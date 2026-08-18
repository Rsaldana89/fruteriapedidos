import type { OrderInput } from "@/src/lib/order-schema";
import { buildWhatsAppMessage } from "@/src/lib/whatsapp";

export async function notifyOrderByEmail(order: OrderInput, orderNumber: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, ORDER_NOTIFICATION_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM || !ORDER_NOTIFICATION_EMAIL) {
    return { sent: false as const, configured: false as const };
  }
  try {
    const name = "nodemailer";
    const nodemailer = await import(/* @vite-ignore */ name);
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
    await transport.sendMail({
      from: SMTP_FROM,
      to: ORDER_NOTIFICATION_EMAIL,
      subject: `Nuevo pedido ${orderNumber} — ${order.customerName}`,
      text: buildWhatsAppMessage(order, orderNumber),
      replyTo: order.email || undefined,
    });
    return { sent: true as const, configured: true as const };
  } catch (error) {
    console.error("No fue posible enviar la notificación SMTP", error instanceof Error ? error.message : error);
    return { sent: false as const, configured: true as const };
  }
}
