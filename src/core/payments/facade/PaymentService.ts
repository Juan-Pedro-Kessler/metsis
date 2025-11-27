
import { PaymentFactory, Provider } from '../factories/PaymentFactory';
import { RetryDecorator } from '../decorators/RetryDecorator';
import { TelemetryDecorator } from '../decorators/TelemetryDecorator';
import { ChargeInput, RefundInput } from '../PaymentTypes';
import { commandBus } from '../../commands/CommandBus';
import { CapturePaymentCommand } from '../../commands/CapturePaymentCommand';
import { RefundPaymentCommand } from '../../commands/RefundPaymentCommand';

export class PaymentService {
  static async charge(provider: Provider, input: ChargeInput) {
    const base = PaymentFactory.create(provider);
    const wrapped = new TelemetryDecorator(new RetryDecorator(base), provider);
    return commandBus.dispatch(new CapturePaymentCommand(wrapped, input, provider));
  }
  static async refund(provider: Provider, input: RefundInput) {
    const base = PaymentFactory.create(provider);
    const wrapped = new TelemetryDecorator(new RetryDecorator(base), provider);
    return commandBus.dispatch(new RefundPaymentCommand(wrapped, input, provider));
  }
}
