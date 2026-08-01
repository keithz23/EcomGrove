import { PaymentStatus } from '@prisma/client';

const validTransitions: Record<PaymentStatus, PaymentStatus[]> = {
  PENDING: [
    PaymentStatus.SUCCEEDED,
    PaymentStatus.FAILED,
    PaymentStatus.CANCELED,
    PaymentStatus.EXPIRED,
  ],
  SUCCEEDED: [PaymentStatus.REFUNDED],
  FAILED: [],
  CANCELED: [],
  EXPIRED: [],
  REFUNDED: [],
};

export function canTransitionPayment(
  from: PaymentStatus,
  to: PaymentStatus,
): boolean {
  return from === to || validTransitions[from].includes(to);
}
