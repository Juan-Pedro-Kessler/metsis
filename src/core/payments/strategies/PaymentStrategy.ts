
import { ChargeInput, ChargeResult, RefundInput, RefundResult } from '../PaymentTypes';
export interface PaymentStrategy {
  charge(input: ChargeInput): Promise<ChargeResult>;
  refund(input: RefundInput): Promise<RefundResult>;
}
