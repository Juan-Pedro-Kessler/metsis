
import { Command } from './Command';

/**
 * Invocador que solo sabe recibir un Command<R> y llamar a execute()
 * 
 * No está acoplado a detalles de pagos ni eventos, solo a la interfaz
 */
export class CommandBus {
  async dispatch<R>(cmd: Command<R>) { return cmd.execute(); }
}
export const commandBus = new CommandBus();
