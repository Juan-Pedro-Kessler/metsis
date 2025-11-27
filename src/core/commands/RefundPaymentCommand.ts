
import { Command } from './Command';
import { RefundInput, RefundResult } from '../payments/PaymentTypes';
import { PaymentStrategy } from '../payments/strategies/PaymentStrategy';
import { eventBus } from '../events/EventBus';

export class RefundPaymentCommand implements Command<RefundResult> {
  constructor(private strategy: PaymentStrategy, private input: RefundInput, private provider: string) {}
  async execute() {
    const res = await this.strategy.refund(this.input);
    if (res.status === 'refunded')
      await eventBus.emit('PaymentRefunded', { paymentId: res.id, amount: this.input.amount ?? 0, provider: this.provider });
    return res;
  }
}
