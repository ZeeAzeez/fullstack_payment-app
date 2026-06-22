import Stripe from 'stripe';
import { config } from '../config';
import { ValidationError } from '../utils/errors';

let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    if (!config.stripe.secretKey) {
      throw new ValidationError('Stripe not configured');
    }
    stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2024-11-20.acacia',
    });
  }
  return stripe;
}

export class StripeService {
  async createPaymentIntent(amount: number, currency: string, metadata?: Record<string, string>) {
    const client = getStripe();
    return client.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata,
    });
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    const client = getStripe();
    return client.paymentIntents.confirm(paymentIntentId);
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    const client = getStripe();
    return client.paymentIntents.retrieve(paymentIntentId);
  }

  constructWebhookEvent(payload: Buffer, signature: string) {
    const client = getStripe();
    return client.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);
  }
}
