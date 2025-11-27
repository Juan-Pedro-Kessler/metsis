import {
  ChargeInput,
  ChargeResult,
  RefundInput,
  RefundResult,
} from "../PaymentTypes";
import { PaymentProvider } from "./PaymentProvider";

export class StripeAdapter  implements PaymentProvider{
  constructor(
    private sdk: {
      charges: { create: (p: any) => Promise<any> };
      refunds: { create: (p: any) => Promise<any> };
    }
  ) {}
  async pay(i: ChargeInput): Promise<ChargeResult> {
    const res = await this.sdk.charges.create({
      amount: i.amount,
      currency: i.currency,
      source: i.token,
      metadata: i.metadata,
    });
    return { id: res.id, status: res.paid ? "approved" : "declined", raw: res };
  }
  async refund(i: RefundInput): Promise<RefundResult> {
    const res = await this.sdk.refunds.create({
      payment_intent: i.paymentId,
      amount: i.amount,
    });
    return {
      id: res.id,
      status: res.status === "succeeded" ? "refunded" : "failed",
      raw: res,
    };
  }
}
