import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1).max(160),
  productName: z.string().min(1).max(180),
  unit: z.string().min(1).max(20),
  quantity: z.number().positive().max(10000),
  unitPrice: z.number().nonnegative().max(1_000_000).nullable(),
  subtotal: z.number().nonnegative().max(10_000_000).nullable(),
});

export const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Escribe el nombre del contacto.").max(120),
  phone: z
    .string()
    .trim()
    .min(8, "Escribe un teléfono o WhatsApp válido.")
    .max(25),
  companyName: z.string().trim().max(140).optional().default(""),
  email: z.union([z.literal(""), z.string().email("El correo no es válido.")]).default(""),
  deliveryAddress: z.string().trim().max(280).optional().default(""),
  requestedDeliveryDate: z.string().trim().max(20).optional().default(""),
  preferredTime: z.string().trim().max(80).optional().default(""),
  paymentMethod: z.enum(["", "Efectivo", "Tarjeta", "Transferencia"]).default(""),
  notes: z.string().trim().max(1000).optional().default(""),
  privacyAccepted: z.literal(true, {
    error: "Debes aceptar el aviso de privacidad.",
  }),
  website: z.string().max(0).optional().default(""),
  showPrices: z.boolean(),
  subtotal: z.number().nonnegative().nullable(),
  total: z.number().nonnegative().nullable(),
  items: z.array(orderItemSchema).min(1, "Agrega al menos un producto."),
});

export type OrderInput = z.infer<typeof orderSchema>;
