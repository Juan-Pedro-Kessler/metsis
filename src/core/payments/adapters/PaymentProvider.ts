
import { ChargeInput, ChargeResult, RefundInput, RefundResult } from "../PaymentTypes";

export interface PaymentProvider {
  pay(input: ChargeInput): Promise<ChargeResult>;
  refund(input: RefundInput): Promise<RefundResult>;
}
