import { instance } from '@/lib/axios';

export type PaymentStatus =
  | 'PENDING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELED'
  | 'EXPIRED'
  | 'REFUNDED';

export interface PaymentResponse {
  paymentIntentId: string;
  orderId: string;
  status: PaymentStatus;
  provider: 'STRIPE';
  providerCheckoutSessionId: string | null;
  checkoutUrl: string | null;
}

export const paymentService = {
  create: (orderId: string, idempotencyKey: string) =>
    instance.post<PaymentResponse>('/payments', { orderId, idempotencyKey }),

  findOne: (paymentIntentId: string) =>
    instance.get<PaymentResponse>(`/payments/${paymentIntentId}`),
};
