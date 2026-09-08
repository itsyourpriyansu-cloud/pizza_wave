export interface PaymentProvider { initiate(): Promise<never> }
// Stage 1 defines the replaceable boundary only. No PhonePe simulator is implemented yet.
