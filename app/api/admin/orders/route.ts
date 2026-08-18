import { NextResponse } from "next/server";
import { hasAdminSession } from "@/src/server/admin-session";
import { isDatabaseConfigured, listOrders } from "@/src/server/orders-repository";

export async function GET(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const url = new URL(request.url);
  if (!isDatabaseConfigured()) return NextResponse.json({ databaseConfigured: false, orders: [] });
  try {
    const orders = await listOrders({ status: url.searchParams.get("status") || undefined, query: url.searchParams.get("q") || undefined });
    return NextResponse.json({ databaseConfigured: true, orders });
  } catch {
    return NextResponse.json({ databaseConfigured: true, orders: [], error: "No fue posible consultar la base de datos." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id, status } = await request.json();
  const { updateOrderStatus } = await import("@/src/server/orders-repository");
  try { await updateOrderStatus(Number(id), String(status)); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "No fue posible actualizar el estado." }, { status: 400 }); }
}
