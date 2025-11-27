import { PaymentStrategy } from "./PaymentStrategy";
import {
  ChargeInput,
  ChargeResult,
  RefundInput,
  RefundResult,
} from "../PaymentTypes";
import { MpAdapter } from "../adapters/MpAdapter";
export class MpStrategy implements PaymentStrategy {
  constructor(private adapter: MpAdapter) {}
  charge(i: ChargeInput): Promise<ChargeResult> {
    return this.adapter.pay(i);
  }
  refund(i: RefundInput): Promise<RefundResult> {
    return this.adapter.refund(i);
  }
}
