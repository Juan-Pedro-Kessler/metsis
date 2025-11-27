/**
* Interfaz genérica Command<R> con un único método execute() asíncrono.
* 
* El genérico R permite tipar el resultado (ChargeResult, RefundResult, etc.)
*/
export interface Command<R = unknown> { execute(): Promise<R>; }
