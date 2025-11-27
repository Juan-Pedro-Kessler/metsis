
import { PaymentStrategy } from './PaymentStrategy';
import { ChargeInput, ChargeResult, RefundInput, RefundResult } from '../PaymentTypes';
import { StripeAdapter } from '../adapters/StripeAdapter';
export class StripeStrategy implements PaymentStrategy {
  constructor(private adapter: StripeAdapter) {}
  charge(i: ChargeInput): Promise<ChargeResult> { return this.adapter.pay(i); }
  refund(i: RefundInput): Promise<RefundResult> { return this.adapter.refund(i); }
}
