import type { Metadata } from "next";
import { company, showPrices } from "@/src/config/company";
import { OrderCheckout } from "../components/OrderCheckout";

export const metadata: Metadata = { title: "Hacer pedido | ABF Maxi Alimentos", description: "Prepara tu solicitud de pedido y envíala a ABF por WhatsApp." };

export default function OrderPage() {
  return <main><section className="page-hero order-hero"><div className="shell"><span className="eyebrow">Pedido en línea</span><h1>Cuéntanos qué necesitas</h1><p>Revisa tu selección, deja tus datos y prepara el mensaje. Nuestro equipo confirmará los detalles contigo.</p><div className="step-strip"><span><b>1</b> Productos</span><i /><span><b>2</b> Tus datos</span><i /><span><b>3</b> WhatsApp</span></div></div></section><section className="section shell"><OrderCheckout showPrices={showPrices} whatsappNumber={company.whatsapp} /></section></main>;
}
