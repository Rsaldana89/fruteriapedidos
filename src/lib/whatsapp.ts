import type { OrderInput } from "./order-schema";

export function buildWhatsAppMessage(order: OrderInput, orderNumber: string) {
  const lines = [
    "PEDIDO ABF MAXI ALIMENTOS",
    `Folio: ${orderNumber}`,
    "",
    `Contacto: ${order.customerName}`,
    `Teléfono: ${order.phone}`,
  ];
  if (order.companyName) lines.push(`Empresa / negocio: ${order.companyName}`);
  if (order.email) lines.push(`Correo: ${order.email}`);
  if (order.deliveryAddress) lines.push(`Dirección: ${order.deliveryAddress}`);
  lines.push("", "PRODUCTOS");
  for (const item of order.items) {
    const price =
      order.showPrices && item.subtotal !== null
        ? ` — ${item.subtotal.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`
        : "";
    lines.push(`${item.quantity} ${item.unit} — ${item.productName}${price}`);
  }
  if (order.showPrices && order.total !== null) {
    lines.push(
      "",
      `Total estimado: ${order.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`,
    );
  }
  if (order.requestedDeliveryDate) lines.push(`Entrega solicitada: ${order.requestedDeliveryDate}`);
  if (order.preferredTime) lines.push(`Horario preferido: ${order.preferredTime}`);
  if (order.paymentMethod) lines.push(`Pago preferido: ${order.paymentMethod}`);
  if (order.notes) lines.push(`Notas: ${order.notes}`);
  lines.push("", "Este mensaje prepara la solicitud; ABF confirmará disponibilidad y entrega.");
  return lines.join("\n");
}

export function buildWhatsAppUrl(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
