import { z } from 'zod'

export const cartQuoteSchema = z.object({
  itemCount: z.number().int().nonnegative(),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  pointsRequested: z.number().int().nonnegative(),
  pointsUsable: z.number().int().nonnegative(),
  pointsValue: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  eligibleSpend: z.number().nonnegative(),
  pointsToEarn: z.number().int().nonnegative(),
  total: z.number().nonnegative(),
  offerApplied: z.string().optional(),
  warnings: z.array(z.string()),
  valid: z.boolean(),
})
