import type { OrderInput } from "@/src/lib/order-schema";

export type StoredOrder = OrderInput & {
  id: number;
  orderNumber: string;
  status: string;
  createdAt: string;
};

async function mysqlModule() {
  const name = "mysql2/promise";
  return import(/* @vite-ignore */ name);
}

async function connection() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  const mysql = await mysqlModule();
  return mysql.createConnection(databaseUrl);
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function saveOrder(order: OrderInput, orderNumber: string) {
  const db = await connection();
  if (!db) return { persisted: false as const };
  try {
    await db.beginTransaction();
    const [result] = await db.execute(
      `INSERT INTO orders
      (order_number, created_at, customer_name, company_name, phone, email,
       delivery_address, requested_delivery_date, preferred_time, payment_method,
       notes, subtotal, total, status)
      VALUES (?, NOW(), ?, ?, ?, ?, ?, NULLIF(?, ''), ?, ?, ?, ?, ?, 'pending')`,
      [
        orderNumber,
        order.customerName,
        order.companyName || null,
        order.phone,
        order.email || null,
        order.deliveryAddress || null,
        order.requestedDeliveryDate || "",
        order.preferredTime || null,
        order.paymentMethod || null,
        order.notes || null,
        order.subtotal,
        order.total,
      ],
    );
    const orderId = Number((result as { insertId: number }).insertId);
    for (const item of order.items) {
      await db.execute(
        `INSERT INTO order_items
        (order_id, product_id, product_name, unit, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.productName, item.unit, item.quantity, item.unitPrice, item.subtotal],
      );
    }
    await db.commit();
    return { persisted: true as const, id: orderId };
  } catch (error) {
    await db.rollback();
    console.error("No fue posible guardar el pedido en MySQL", error instanceof Error ? error.message : error);
    throw error;
  } finally {
    await db.end();
  }
}

export async function listOrders(filters: { status?: string; query?: string } = {}) {
  const db = await connection();
  if (!db) return [];
  try {
    const where: string[] = [];
    const values: string[] = [];
    if (filters.status) { where.push("o.status = ?"); values.push(filters.status); }
    if (filters.query) {
      where.push("(o.customer_name LIKE ? OR o.company_name LIKE ? OR o.order_number LIKE ?)");
      const term = `%${filters.query}%`;
      values.push(term, term, term);
    }
    const [rows] = await db.execute(
      `SELECT o.id, o.order_number AS orderNumber, o.created_at AS createdAt,
        o.customer_name AS customerName, o.company_name AS companyName,
        o.phone, o.email, o.delivery_address AS deliveryAddress,
        o.requested_delivery_date AS requestedDeliveryDate,
        o.preferred_time AS preferredTime, o.payment_method AS paymentMethod,
        o.notes, o.subtotal, o.total, o.status
       FROM orders o ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY o.created_at DESC LIMIT 250`,
      values,
    );
    return rows as Array<Record<string, unknown>>;
  } finally {
    await db.end();
  }
}

export async function updateOrderStatus(id: number, status: string) {
  const allowed = ["pending", "confirmed", "preparing", "delivered", "cancelled"];
  if (!allowed.includes(status)) throw new Error("Estado no válido");
  const db = await connection();
  if (!db) throw new Error("Base de datos no disponible");
  try {
    await db.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
  } finally {
    await db.end();
  }
}
