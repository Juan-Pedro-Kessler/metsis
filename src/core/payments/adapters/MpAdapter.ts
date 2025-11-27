import {
  ChargeInput,
  ChargeResult,
  RefundInput,
  RefundResult,
} from "../PaymentTypes";
import { PaymentProvider } from "./PaymentProvider";
export class MpAdapter implements PaymentProvider {
  constructor(
    
    private sdk: {
      payments: {
        create: (p: any) => Promise<any>;
        refund: (id: string, p: any) => Promise<any>;
      };
    }
  ) {}
  async pay(i: ChargeInput): Promise<ChargeResult> {
    const res = await this.sdk.payments.create({
      transaction_amount: i.amount,
      token: i.token,
      description: "Charge",
      metadata: i.metadata,
    });
    return {
      id: res.id,
      status: res.status === "approved" ? "approved" : "declined",
      raw: res,
    };
  }
  async refund(i: RefundInput): Promise<RefundResult> {
    const res = await this.sdk.payments.refund(i.paymentId, {
      amount: i.amount,
    });
    return {
      id: res.id,
      status: res.status === "approved" ? "refunded" : "failed",
      raw: res,
    };
  }
}
