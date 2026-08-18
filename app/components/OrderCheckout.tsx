"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Minus, Plus, Send, ShoppingBasket, Trash2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { orderSchema, type OrderInput } from "@/src/lib/order-schema";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/src/lib/whatsapp";
import { useCart } from "../providers";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
type Result = { orderNumber: string; persisted: boolean; storageError: boolean; emailSent: boolean; emailConfigured: boolean; whatsappUrl: string };

export function OrderCheckout({ showPrices, whatsappNumber }: { showPrices: boolean; whatsappNumber: string }) {
  const { lines, update, remove, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const total = useMemo(() => lines.reduce((sum, line) => sum + line.price * line.quantity, 0), [lines]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") || ""),
      phone: String(form.get("phone") || ""),
      companyName: String(form.get("companyName") || ""),
      email: String(form.get("email") || ""),
      deliveryAddress: String(form.get("deliveryAddress") || ""),
      requestedDeliveryDate: String(form.get("requestedDeliveryDate") || ""),
      preferredTime: String(form.get("preferredTime") || ""),
      paymentMethod: String(form.get("paymentMethod") || ""),
      notes: String(form.get("notes") || ""),
      privacyAccepted: form.get("privacyAccepted") === "on",
      website: String(form.get("website") || ""),
      showPrices,
      subtotal: showPrices ? total : null,
      total: showPrices ? total : null,
      items: lines.map((line) => ({
        productId: line.id,
        productName: line.name,
        unit: line.unit,
        quantity: line.quantity,
        unitPrice: showPrices ? line.price : null,
        subtotal: showPrices ? Number((line.price * line.quantity).toFixed(2)) : null,
      })),
    };
    const parsed = orderSchema.safeParse(payload);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || "Revisa los datos."); return; }
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parsed.data) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No pudimos preparar el pedido.");
      const whatsappUrl = buildWhatsAppUrl(whatsappNumber, buildWhatsAppMessage(parsed.data as OrderInput, data.orderNumber));
      setResult({ ...data, whatsappUrl });
    } catch (caught) {
      const fallbackNumber = `ABF-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-TEMP`;
      const whatsappUrl = buildWhatsAppUrl(whatsappNumber, buildWhatsAppMessage(parsed.data as OrderInput, fallbackNumber));
      setResult({ orderNumber: fallbackNumber, persisted: false, storageError: true, emailSent: false, emailConfigured: false, whatsappUrl });
      setError(caught instanceof Error ? caught.message : "No pudimos registrar el pedido; puedes enviarlo por WhatsApp.");
    } finally { setSubmitting(false); }
  }

  if (lines.length === 0) {
    return <div className="empty-order"><ShoppingBasket size={52} /><span className="eyebrow">Mi pedido</span><h2>Aún no has agregado productos</h2><p>Busca lo que necesitas en el catálogo. Tu selección permanecerá guardada en este dispositivo.</p><Link className="button button-primary" href="/productos">Explorar productos</Link></div>;
  }

  return (
    <div className="checkout-grid">
      <section className="order-card order-items-card"><div className="card-title"><div><span className="eyebrow">Paso 1</span><h2>Revisa tus productos</h2></div><button className="text-button" type="button" onClick={clear}>Vaciar pedido</button></div>
        <div className="checkout-lines">{lines.map((line) => { const step = /KG/i.test(line.unit) ? 0.5 : 1; return <article key={line.id}><div><strong>{line.name}</strong><span>{line.unit}{showPrices ? ` · ${money.format(line.price)}` : ""}</span></div><div className="quantity-control"><button type="button" onClick={() => line.quantity > step ? update(line.id, line.quantity - step) : remove(line.id)} aria-label="Reducir"><Minus size={15} /></button><input type="number" min={step} step={step} value={line.quantity} onChange={(e) => update(line.id, Number(e.target.value))} aria-label={`Cantidad de ${line.name}`} /><button type="button" onClick={() => update(line.id, line.quantity + step)} aria-label="Aumentar"><Plus size={15} /></button></div>{showPrices && <b>{money.format(line.price * line.quantity)}</b>}<button type="button" className="icon-button" onClick={() => remove(line.id)} aria-label={`Eliminar ${line.name}`}><Trash2 size={17} /></button></article>; })}</div>
        {showPrices && <div className="estimated-total"><span>Total estimado</span><strong>{money.format(total)}</strong></div>}<p className="fine-print">Los precios y el total son estimados. ABF confirmará disponibilidad, condiciones de entrega y monto final.</p>
      </section>

      <form className="order-card customer-form" onSubmit={submit} noValidate><div className="card-title"><div><span className="eyebrow">Paso 2</span><h2>Datos de contacto</h2></div></div>
        <div className="field-grid"><label><span>Nombre del contacto *</span><input name="customerName" required autoComplete="name" /></label><label><span>Teléfono / WhatsApp *</span><input name="phone" required inputMode="tel" autoComplete="tel" /></label><label><span>Empresa o negocio</span><input name="companyName" autoComplete="organization" /></label><label><span>Correo electrónico</span><input name="email" type="email" autoComplete="email" /></label><label className="field-wide"><span>Dirección de entrega</span><input name="deliveryAddress" autoComplete="street-address" /></label><label><span>Fecha solicitada</span><input name="requestedDeliveryDate" type="date" /></label><label><span>Horario preferido</span><input name="preferredTime" placeholder="Ej. 8:00 a 11:00" /></label><label><span>Método de pago preferido</span><select name="paymentMethod" defaultValue=""><option value="">Por definir</option><option>Efectivo</option><option>Tarjeta</option><option>Transferencia</option></select></label><label className="field-wide"><span>Notas o instrucciones</span><textarea name="notes" rows={4} placeholder="Presentación, madurez, acceso, referencias…" /></label><label className="honeypot" aria-hidden="true">Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="privacy-check"><input name="privacyAccepted" type="checkbox" required /><span>Acepto que ABF use estos datos para atender mi solicitud, conforme al <Link href="/aviso-de-privacidad" target="_blank">aviso de privacidad</Link>.</span></label>
        {error && <div className="form-alert error"><AlertCircle size={19} /><span>{error}</span></div>}
        {result && <div className="result-panel"><CheckCircle2 size={28} /><div><h3>Tu solicitud está lista</h3><p>Folio: <strong>{result.orderNumber}</strong></p><p>{result.persisted ? "Pedido registrado en la plataforma de ABF." : result.storageError ? "No pudimos registrarlo en la plataforma, pero puedes enviarlo por WhatsApp." : "La base de datos está desactivada; continúa por WhatsApp."}</p>{result.emailConfigured && <p>{result.emailSent ? "ABF recibió también una notificación por correo." : "La notificación por correo no pudo enviarse."}</p>}</div><a className="button whatsapp-button button-wide" href={result.whatsappUrl} target="_blank" rel="noreferrer" onClick={() => window.setTimeout(clear, 1200)}><Send size={18} /> Enviar pedido por WhatsApp</a><small>Se abrirá WhatsApp con el mensaje preparado. El pedido no se envía hasta que tú confirmes el envío.</small></div>}
        {!result && <button className="button button-primary button-wide submit-order" type="submit" disabled={submitting}>{submitting ? <><Loader2 className="spin" size={18} /> Preparando pedido…</> : <><Send size={18} /> Preparar pedido</>}</button>}
      </form>
    </div>
  );
}
