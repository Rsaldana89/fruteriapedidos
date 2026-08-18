"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2, X } from "lucide-react";
import { showPrices } from "@/src/config/company";
import { useCart } from "../providers";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export function CartDrawer() {
  const { lines, isOpen, close, update, remove, clear } = useCart();
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  if (!isOpen) return null;
  return (
    <div className="drawer-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Mi pedido">
        <div className="drawer-header"><div><span className="eyebrow">Solicitud</span><h2>Mi pedido</h2></div><button type="button" onClick={close} aria-label="Cerrar pedido"><X /></button></div>
        {lines.length === 0 ? (
          <div className="empty-cart"><ShoppingBasket size={44} /><h3>Tu pedido está vacío</h3><p>Explora el catálogo y agrega los productos que necesitas.</p><Link className="button button-primary" href="/productos" onClick={close}>Ver productos</Link></div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map((line) => {
                const step = /KG/i.test(line.unit) ? 0.5 : 1;
                return (
                  <article className="cart-line" key={line.id}>
                    <div className="cart-line-top"><div><strong>{line.name}</strong><small>{line.unit}{showPrices ? ` · ${money.format(line.price)}` : ""}</small></div><button type="button" onClick={() => remove(line.id)} aria-label={`Eliminar ${line.name}`}><Trash2 size={17} /></button></div>
                    <div className="quantity-row"><button type="button" onClick={() => line.quantity > step ? update(line.id, line.quantity - step) : remove(line.id)} aria-label="Reducir"><Minus size={15} /></button><input aria-label={`Cantidad de ${line.name}`} type="number" min={step} max="10000" step={step} value={line.quantity} onChange={(e) => update(line.id, Number(e.target.value))} /><button type="button" onClick={() => update(line.id, line.quantity + step)} aria-label="Aumentar"><Plus size={15} /></button>{showPrices && <b>{money.format(line.price * line.quantity)}</b>}</div>
                  </article>
                );
              })}
            </div>
            <div className="drawer-summary">{showPrices && <div><span>Total estimado</span><strong>{money.format(total)}</strong></div>}<p>ABF confirmará disponibilidad, precio final y entrega.</p><Link className="button button-primary button-wide" href="/pedido" onClick={close}>Continuar pedido</Link><button className="text-button" type="button" onClick={clear}>Vaciar pedido</button></div>
          </>
        )}
      </aside>
    </div>
  );
}
