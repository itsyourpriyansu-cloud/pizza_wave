import { createId } from '../../domain/shared/ids'
import type { PaymentInitiateInput, PaymentInitiateResult, PaymentProvider, PaymentRefundResult, PaymentStatusResult } from './PaymentProvider'

export type DemoPaymentOutcome = 'AUTO_CONFIRM' | 'STAY_PENDING' | 'FAIL'

interface DemoAttempt { merchantOrderId: string; providerTransactionId: string; amount: number; outcome: DemoPaymentOutcome; status: PaymentStatusResult['status'] }

/**
 * Fake PhonePe. No network call is ever made. `outcome` is set per merchantOrderId by demo
 * scenarios (paymentFailure -> FAIL, paymentPending -> STAY_PENDING) and defaults to
 * AUTO_CONFIRM so the happy path "just works" in the pitch demo.
 */
export class DemoPhonePeProvider implements PaymentProvider {
  private attempts = new Map<string, DemoAttempt>()
  private pendingOutcomes = new Map<string, DemoPaymentOutcome>()

  setNextOutcome(merchantOrderId: string, outcome: DemoPaymentOutcome): void {
    this.pendingOutcomes.set(merchantOrderId, outcome)
  }

  async initiate({ merchantOrderId, amount }: PaymentInitiateInput): Promise<PaymentInitiateResult> {
    const outcome = this.pendingOutcomes.get(merchantOrderId) ?? 'AUTO_CONFIRM'
    this.pendingOutcomes.delete(merchantOrderId)
    const providerTransactionId = createId('PHONEPE-TXN')
    this.attempts.set(merchantOrderId, { merchantOrderId, providerTransactionId, amount, outcome, status: outcome === 'FAIL' ? 'FAILED' : outcome === 'STAY_PENDING' ? 'PENDING' : 'CONFIRMED' })
    return { redirectUrl: `demo://phonepe/checkout/${merchantOrderId}`, providerReferenceId: providerTransactionId }
  }

  async getStatus(merchantOrderId: string): Promise<PaymentStatusResult> {
    const attempt = this.attempts.get(merchantOrderId)
    if (!attempt) return { status: 'PENDING' }
    return { status: attempt.status, providerTransactionId: attempt.providerTransactionId, failureReason: attempt.status === 'FAILED' ? 'Demo payment marked as failed' : undefined }
  }

  /** Demo-only control surface — not part of the PaymentProvider interface a real adapter would expose this way. */
  succeedDemoPayment(merchantOrderId: string): void {
    const attempt = this.attempts.get(merchantOrderId)
    if (attempt) attempt.status = 'CONFIRMED'
  }
  failDemoPayment(merchantOrderId: string): void {
    const attempt = this.attempts.get(merchantOrderId)
    if (attempt) attempt.status = 'FAILED'
  }
  resolvePendingDemoPayment(merchantOrderId: string, status: 'CONFIRMED' | 'FAILED'): void {
    const attempt = this.attempts.get(merchantOrderId)
    if (attempt) attempt.status = status
  }

  async refund(providerTransactionId: string, _amount?: number): Promise<PaymentRefundResult> {
    return { status: 'SUCCESS', providerRefundId: `${providerTransactionId}-REFUND` }
  }
}

export const demoPhonePeProvider = new DemoPhonePeProvider()
