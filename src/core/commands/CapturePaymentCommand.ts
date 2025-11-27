import { Command } from "./Command";
import { ChargeInput, ChargeResult } from "../payments/PaymentTypes";
import { PaymentStrategy } from "../payments/strategies/PaymentStrategy";
import { eventBus } from "../events/EventBus";

export class CapturePaymentCommand implements Command<ChargeResult> {
  constructor(
    private strategy: PaymentStrategy,
    private input: ChargeInput,
    private provider: string
  ) {}
  async execute() {
    const res = await this.strategy.charge(this.input);
    if (res.status === "approved")
      await eventBus.emit("PaymentCaptured", {
        paymentId: res.id,
        amount: this.input.amount,
        provider: this.provider,
      });
    else
      await eventBus.emit("PaymentFailed", {
        reason: "declined",
        provider: this.provider,
      });
    return res;
  }
}
