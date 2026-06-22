import { prisma } from '../config/database';
import { CreatePaymentInput, PaymentResponse } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';

export class PaymentService {
  /**
   * Creates an internal wallet-to-wallet payment using a Prisma transaction.
   * Atomically deducts from sender, credits receiver, and records transactions.
   */
  async createPayment(senderId: string, input: CreatePaymentInput): Promise<PaymentResponse> {
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { email: input.receiverEmail } }),
    ]);

    if (!sender) throw new NotFoundError('Sender');
    if (!receiver) throw new NotFoundError('Receiver');
    if (receiver.id === senderId) throw new ValidationError('Cannot send payment to yourself');
    if (sender.balance < input.amount) throw new ValidationError('Insufficient balance');

    const payment = await prisma.$transaction(async (tx) => {
      // Deduct from sender
      await tx.user.update({
        where: { id: senderId },
        data: { balance: { decrement: input.amount } },
      });

      // Credit receiver
      await tx.user.update({
        where: { id: receiver.id },
        data: { balance: { increment: input.amount } },
      });

      // Create the payment record as COMPLETED
      const newPayment = await tx.payment.create({
        data: {
          amount: input.amount,
          currency: input.currency,
          description: input.description,
          senderId,
          receiverId: receiver.id,
          status: 'COMPLETED',
        },
        include: {
          sender: { select: { id: true, name: true, email: true } },
          receiver: { select: { id: true, name: true, email: true } },
        },
      });

      // Record ledger transactions for both parties
      const ref = `PAY-${newPayment.id}`;
      await tx.transaction.createMany({
        data: [
          {
            type: 'DEBIT',
            amount: input.amount,
            reference: `${ref}-D`,
            userId: senderId,
            metadata: { paymentId: newPayment.id },
          },
          {
            type: 'CREDIT',
            amount: input.amount,
            reference: `${ref}-C`,
            userId: receiver.id,
            metadata: { paymentId: newPayment.id },
          },
        ],
      });

      return newPayment;
    });

    return payment;
  }

  async getUserPayments(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        include: {
          sender: { select: { id: true, name: true, email: true } },
          receiver: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payment.count({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      }),
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPaymentById(paymentId: string, userId: string): Promise<PaymentResponse> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    if (!payment) {
      throw new NotFoundError('Payment');
    }

    if (payment.senderId !== userId && payment.receiverId !== userId) {
      throw new NotFoundError('Payment');
    }

    return payment;
  }
}
