import { z } from "zod";

export const PaymentRefundSchema = z.object({
provider: z.string().min(1, "provider es requerido"),
  paymentId: z
    .string({
      required_error: "El campo 'paymentId' es obligatorio",
      invalid_type_error: "El campo 'paymentId' debe ser una cadena de texto",
    })
    .min(1, "El campo 'paymentId' no puede estar vacío"),

  amount: z
    .number({
      invalid_type_error: "El campo 'amount' debe ser un número",
    })
    .positive("El monto debe ser mayor que 0")
    .optional(),


});

export type PaymentRefundInput =  z.infer<typeof PaymentRefundSchema>;