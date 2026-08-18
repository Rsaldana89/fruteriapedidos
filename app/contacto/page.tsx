import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { company } from "@/src/config/company";
import { buildWhatsAppUrl } from "@/src/lib/whatsapp";

export const metadata: Metadata = { title: "Contacto | ABF Maxi Alimentos", description: "Contacta a ABF Maxi Alimentos en Corregidora, Querétaro." };

export default function ContactPage() {
  const whatsapp = buildWhatsAppUrl(company.whatsapp, "Hola ABF Maxi Alimentos, me gustaría solicitar información.");
  return <main><section className="page-hero contact-hero"><div className="shell"><span className="eyebrow">Contacto</span><h1>Estamos listos para atenderte</h1><p>Cuéntanos qué necesita tu negocio u hogar. Te ayudaremos a preparar una solución de abastecimiento adecuada.</p></div></section><section className="section shell contact-grid"><div className="contact-card"><MapPin /><div><span>Visítanos</span><h2>ABF Maxi Alimentos</h2><p>{company.address}</p><a href="https://maps.google.com/?q=Paseo+Constituyentes+1602+El+Pueblito+Corregidora+Queretaro" target="_blank" rel="noreferrer">Abrir en Maps</a></div></div><div className="contact-options"><a href={`tel:${company.phoneHref}`}><Phone /><div><span>Teléfono</span><strong>{company.phoneDisplay}</strong></div></a><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle /><div><span>WhatsApp</span><strong>Iniciar conversación</strong></div></a><a href={`mailto:${company.email}`}><Mail /><div><span>Correo</span><strong>{company.email}</strong></div></a><a href={company.instagramUrl} target="_blank" rel="noreferrer"><Send /><div><span>Instagram</span><strong>{company.instagram}</strong></div></a></div></section><section className="section payment-band"><div className="shell"><div><span className="eyebrow">Medios de pago</span><h2>Efectivo, tarjeta y transferencia</h2></div><p>El método se confirma directamente con ABF. Esta versión del sitio no procesa cobros en línea.</p></div></section></main>;
}
