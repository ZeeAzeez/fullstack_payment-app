import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config';
import { RegisterUserInput, LoginUserInput, AuthPayload } from '../types';
import { ValidationError, UnauthorizedError } from '../utils/errors';

const SALT_ROUNDS = 12;

export class AuthService {
  async register(input: RegisterUserInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ValidationError('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true, balance: true, createdAt: true },
    });

    const token = this.generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  async login(input: LoginUserInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(input.password, user.password);
    if (!validPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken({ userId: user.id, email: user.email });

    return {
      user: { id: user.id, email: user.email, name: user.name, balance: user.balance },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, balance: true, createdAt: true },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  /**
   * Adds balance to a user account (in cents). Used for dev top-ups and
   * production Stripe webhook-confirmed deposits.
   */
  async topupBalance(userId: string, amount: number) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new ValidationError('Amount must be a positive integer (in cents)');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
      select: { id: true, email: true, name: true, balance: true },
    });

    await prisma.transaction.create({
      data: {
        type: 'TOPUP',
        amount,
        reference: `TOPUP-${Date.now()}-${userId.slice(0, 8)}`,
        userId,
        metadata: { source: 'manual' },
      },
    });

    return user;
  }

  private generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }
}
