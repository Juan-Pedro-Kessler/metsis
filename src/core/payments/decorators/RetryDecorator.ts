import { PaymentStrategy } from "../strategies/PaymentStrategy";
import {
  ChargeInput,
  ChargeResult,
  RefundInput,
  RefundResult,
} from "../PaymentTypes";

export class RetryDecorator implements PaymentStrategy {
  constructor(
    private inner: PaymentStrategy,
    private times = 2,
    private delayMs = 100
  ) {}
  private async retry<T>(fn: () => Promise<T>): Promise<T> {
    let lastErr: any;
    for (let i = 0; i <= this.times; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        if (i < this.times)
          await new Promise((r) => setTimeout(r, this.delayMs));
      }
    }
    throw lastErr;
  }
  charge(i: ChargeInput): Promise<ChargeResult> {
    return this.retry(() => this.inner.charge(i));
  }
  refund(i: RefundInput): Promise<RefundResult> {
    return this.retry(() => this.inner.refund(i));
  }
}
