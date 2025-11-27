import { ChargeInput, ChargeResult, RefundInput, RefundResult } from "../PaymentTypes";
import { PaymentStrategy } from "./PaymentStrategy";

export class PaymentContext {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  public charge(input: ChargeInput): Promise<ChargeResult> {
    return this.strategy.charge(input);
  }

  public refund(input: RefundInput): Promise<RefundResult> {
    return this.strategy.refund(input);
  }
}
