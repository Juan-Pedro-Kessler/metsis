import { z } from "zod";

export const PaymentChargeSchema = z.object({
  provider: z.string().min(1, "provider es requerido"),
  amount: z
    .number({
      required_error: "El campo 'amount' es obligatorio",
      invalid_type_error: "El campo 'amount' debe ser un número",
    })
    .positive("El monto debe ser mayor que 0"),

  currency: z
    .string({
      invalid_type_error: "La moneda debe ser una cadena de texto",
    })
    .length(3, "La moneda debe tener 3 caracteres (por ejemplo, 'USD')")
    .optional(),

  method: z
    .enum(["credit_card", "debit_card", "transfer", "cash"], {
      invalid_type_error:
        "El método de pago debe ser uno de: credit_card, debit_card, transfer, cash",
    })
    .optional(),

  description: z
    .string({
      invalid_type_error: "La descripción debe ser una cadena de texto",
    })
    .max(255, "La descripción no puede superar los 255 caracteres")
    .optional(),


  token: z.string().min(1, "token no puede estar vacío").optional(),
  metadata: z.record(z.any()).optional(),
  
  
});

export type PaymentChargeInput = z.infer<typeof PaymentChargeSchema>;
