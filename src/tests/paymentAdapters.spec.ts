// tests/paymentAdapters.spec.ts
import { describe, it, expect, vi } from "vitest";
import { MpAdapter } from "../core/payments/adapters/MpAdapter";
import { StripeAdapter } from "../core/payments/adapters/StripeAdapter";
import { ChargeInput, RefundInput } from "../core/payments/PaymentTypes";



describe("StripeAdapter", () => {
  it("pay() debe llamar al SDK y devolver un ChargeResult normalizado", async () => {
    const chargesCreate = vi.fn().mockResolvedValue({
      id: "ch_123",
      paid: true,
      status: "succeeded",
    });

    const refundsCreate = vi.fn(); // no se usa en este test pero lo requiere el ctor

    const fakeStripeSdk = {
      charges: {
        create: chargesCreate,
      },
      refunds: {
        create: refundsCreate,
      },
    };

    const adapter = new StripeAdapter(fakeStripeSdk);

    const input: ChargeInput = {
      amount: 1000,
      currency: "ARS",
      token: '12345',
  
    } as ChargeInput;


    const result = await adapter.pay(input);

    // 1) Llamó al SDK con el monto correcto
    expect(chargesCreate).toHaveBeenCalledTimes(1);
    expect(chargesCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: input.amount,
      })
    );

    // 2) Mapeo a tu tipo de dominio
    expect(result.id).toBe("ch_123");
    expect(result.status).toBe("approved"); // porque paid: true
    expect(result.raw).toEqual(
      expect.objectContaining({
        id: "ch_123",
        paid: true,
      })
    );
  });

  it("refund() debe llamar al SDK y devolver un RefundResult normalizado", async () => {
    const chargesCreate = vi.fn();

    const refundsCreate = vi.fn().mockResolvedValue({
      id: "re_456",
      status: "succeeded",
    });

    const fakeStripeSdk = {
      charges: {
        create: chargesCreate,
      },
      refunds: {
        create: refundsCreate,
      },
    };

    const adapter = new StripeAdapter(fakeStripeSdk);

    const input: RefundInput = {
      paymentId: "ch_123",
      amount: 500,
      // idem: agrega más campos si tu tipo lo requiere
    } as RefundInput;

    const result = await adapter.refund(input);

    // 1) Llamó al SDK con los parámetros esperados
    expect(refundsCreate).toHaveBeenCalledTimes(1);
    expect(refundsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_intent: input.paymentId,
        amount: input.amount,
      })
    );

    // 2) Normalización de dominio
    expect(result.id).toBe("re_456");
    expect(result.status).toBe("refunded"); // porque status === "succeeded"
    expect(result.raw).toEqual(
      expect.objectContaining({
        id: "re_456",
        status: "succeeded",
      })
    );
  });
});

describe("MpAdapter", () => {
  it("pay() debe llamar a payments.create y devolver un ChargeResult normalizado", async () => {
    const paymentsCreate = vi.fn().mockResolvedValue({
      id: "mp_pay_1",
      status: "approved",
    });

    const paymentsRefund = vi.fn();

    const fakeMpSdk = {
      payments: {
        create: paymentsCreate,
        refund: paymentsRefund,
      },
    };

    const adapter = new MpAdapter(fakeMpSdk);

    const input: ChargeInput = {
      amount: 2000,
      currency: "ARS",
        token: '345677'
    } as ChargeInput;

    const result = await adapter.pay(input);

    // 1) Llamó al SDK con el monto correcto
    expect(paymentsCreate).toHaveBeenCalledTimes(1);
    expect(paymentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        transaction_amount: input.amount,
      })
    );

    // 2) Normalización de resultado
    expect(result.id).toBe("mp_pay_1");
    expect(result.status).toBe("approved");
    expect(result.raw).toEqual(
      expect.objectContaining({
        id: "mp_pay_1",
        status: "approved",
      })
    );
  });

  it("refund() debe llamar a payments.refund y devolver un RefundResult normalizado", async () => {
    const paymentsCreate = vi.fn();

    const paymentsRefund = vi.fn().mockResolvedValue({
      id: "mp_refund_1",
      status: "approved", // supongamos que MP usa 'approved' para refunds correctos
    });

    const fakeMpSdk = {
      payments: {
        create: paymentsCreate,
        refund: paymentsRefund,
      },
    };

    const adapter = new MpAdapter(fakeMpSdk);

    const input: RefundInput = {
      paymentId: "mp_pay_1",
      amount: 500,
    } as RefundInput;

    const result = await adapter.refund(input);

    // 1) Verificar llamada a SDK
    expect(paymentsRefund).toHaveBeenCalledTimes(1);
    expect(paymentsRefund).toHaveBeenCalledWith(
      input.paymentId,
      expect.objectContaining({
        amount: input.amount,
      })
    );

    // 2) Normalización de dominio
    expect(result.id).toBe("mp_refund_1");
    expect(result.status).toBe("refunded"); // según tu adapter: status === "approved" → "refunded"
    expect(result.raw).toEqual(
      expect.objectContaining({
        id: "mp_refund_1",
        status: "approved",
      })
    );
  });
});
