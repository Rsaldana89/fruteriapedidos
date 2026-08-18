import { NextResponse } from "next/server";
import { orderSchema } from "@/src/lib/order-schema";
import { createOrderNumber } from "@/src/lib/order-number";
import { saveOrder } from "@/src/server/orders-repository";
import { notifyOrderByEmail } from "@/src/server/email";

const recent = new Map<string, number>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const now = Date.now();
  if ((recent.get(ip) || 0) > now - 8000) {
    return NextResponse.json({ error: "Espera unos segundos antes de volver a enviar." }, { status: 429 });
  }
  recent.set(ip, now);
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 }); }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Revisa los datos del pedido." }, { status: 400 });
  }
  const orderNumber = createOrderNumber();
  let persisted = false;
  let storageError = false;
  try { persisted = (await saveOrder(parsed.data, orderNumber)).persisted; } catch { storageError = true; }
  const email = await notifyOrderByEmail(parsed.data, orderNumber);
  return NextResponse.json({
    orderNumber,
    persisted,
    storageError,
    emailSent: email.sent,
    emailConfigured: email.configured,
  });
}
