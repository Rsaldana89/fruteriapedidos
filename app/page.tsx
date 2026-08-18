import Link from "next/link";
import { Apple, ArrowRight, Building2, CalendarCheck2, ChefHat, Coffee, Handshake, Home, Hotel, PackageCheck, Salad, Sprout, Store, Truck, Wheat } from "lucide-react";
import { company } from "@/src/config/company";

const services = [
  { icon: Salad, title: "Frutas y verduras frescas", text: "Productos seleccionados para ofrecer frescura, calidad y disponibilidad." },
  { icon: Wheat, title: "Abarrotes, granos y semillas", text: "Surtido esencial para la operación diaria de negocios y hogares." },
  { icon: Apple, title: "Chiles secos", text: "Variedad de chiles secos y productos complementarios para cocina profesional." },
  { icon: Truck, title: "Entrega y distribución", text: "Entregas a domicilio y distribución programada con cobertura en Querétaro." },
  { icon: Handshake, title: "Atención personalizada", text: "Conocemos tus necesidades y proponemos una solución adecuada a tu operación." },
  { icon: PackageCheck, title: "Abastecimiento integral", text: "Pedidos adaptados al volumen, frecuencia y variedad que cada cliente necesita." },
];

const clients = [
  { icon: ChefHat, label: "Restaurantes" }, { icon: Building2, label: "Comedores industriales" }, { icon: Hotel, label: "Hoteles" }, { icon: Coffee, label: "Cafeterías" }, { icon: Store, label: "Empresas" }, { icon: Home, label: "Hogares" },
];

export default function HomePage() {
  return <main>
    <section className="hero"><div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" /><div className="shell hero-grid">
      <div className="hero-copy"><span className="eyebrow"><Sprout size={16} /> Abastecimiento en Querétaro</span><h1>Alimentos frescos para que tu operación <em>nunca se detenga.</em></h1><p>Frutas, verduras, abarrotes, granos, semillas y chiles secos con atención personalizada y entregas programadas.</p><div className="hero-actions"><Link className="button button-primary" href="/productos">Hacer un pedido <ArrowRight size={18} /></Link><Link className="button button-secondary" href="#servicios">Conocer servicios</Link></div><blockquote>{company.slogan}</blockquote></div>
      <div className="hero-visual" aria-label="Selección de productos de ABF"><div className="produce-mark"><span className="leaf leaf-one" /><span className="leaf leaf-two" /><div className="produce-center"><Salad size={74} strokeWidth={1.35} /></div></div><div className="floating-card card-experience"><strong>+25</strong><span>años de experiencia</span></div><div className="floating-card card-delivery"><Truck size={24} /><span>Entrega programada</span></div><div className="produce-tags"><span>Frutas</span><span>Verduras</span><span>Abarrotes</span><span>Semillas</span></div></div>
    </div><div className="shell trust-bar"><span><PackageCheck size={20} /> Productos seleccionados</span><span><CalendarCheck2 size={20} /> Entregas oportunas</span><span><Handshake size={20} /> Atención personalizada</span></div></section>

    <section className="section about" id="nosotros"><div className="shell two-column"><div><span className="eyebrow">Quiénes somos</span><h2>Un aliado confiable para cada pedido</h2><p className="lead">En ABF trabajamos para brindar soluciones de abastecimiento en frutas, verduras y abarrotes, con productos de calidad, frescura y un servicio oportuno.</p><p>Durante más de 25 años hemos construido relaciones comerciales sólidas a través de atención personalizada, compromiso y cumplimiento. Atendemos restaurantes, comedores, hoteles, cafeterías, empresas y hogares.</p><div className="metric-row"><div><strong>25+</strong><span>Años de experiencia</span></div><div><strong>124</strong><span>Productos en catálogo</span></div><div><strong>QRO</strong><span>Cobertura regional</span></div></div></div><aside className="quote-card"><Sprout size={34} /><blockquote>“En ABF no solo distribuimos frutas y verduras: facilitamos la operación de nuestros clientes para que puedan concentrarse en hacer crecer su negocio.”</blockquote></aside></div></section>

    <section className="section soft-section" id="servicios"><div className="shell"><div className="section-heading"><div><span className="eyebrow">Nuestros servicios</span><h2>Abastecimiento hecho a tu medida</h2></div><p>Una solución integral respaldada por experiencia, logística y atención cercana.</p></div><div className="service-grid">{services.map(({ icon: Icon, title, text }, index) => <article className="service-card" key={title}><span className="service-index">0{index + 1}</span><div className="service-icon"><Icon /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section audience"><div className="shell"><div className="section-heading centered"><div><span className="eyebrow">¿A quién atendemos?</span><h2>Desde una cocina familiar hasta una gran operación</h2></div><p>Nos adaptamos al volumen, frecuencia y variedad que requiere cada cliente.</p></div><div className="audience-grid">{clients.map(({ icon: Icon, label }) => <div key={label}><Icon /><span>{label}</span></div>)}</div></div></section>

    <section className="section mission-section"><div className="shell mission-grid"><article><span className="card-kicker">Nuestra misión</span><h2>Soluciones que facilitan tu día</h2><p>En ABF trabajamos para brindar soluciones de abastecimiento en frutas, verduras y abarrotes, ofreciendo productos de calidad, frescura y un servicio oportuno que contribuya al buen funcionamiento de nuestros clientes.</p><p>Construimos relaciones comerciales sólidas a través de una atención personalizada, compromiso y cumplimiento.</p></article><article><span className="card-kicker">Nuestra visión</span><h2>Crecer con confianza</h2><p>Ser una empresa referente en la distribución y abastecimiento en la región, reconocida por la calidad de nuestros productos, la eficiencia de nuestro servicio y la confianza que generamos en nuestros clientes.</p><p>Buscamos crecer de manera sostenible, ampliar nuestra cobertura y fortalecer nuestra capacidad de respuesta.</p></article></div></section>

    <section className="section catalog-cta"><div className="shell catalog-cta-inner"><div><span className="eyebrow light">Catálogo en línea</span><h2>Tu siguiente pedido comienza aquí</h2><p>Busca productos, indica cantidades y envía tu solicitud por WhatsApp. Sin registro obligatorio y sin pagos en línea.</p><Link className="button button-light" href="/productos">Ver los 124 productos <ArrowRight size={18} /></Link></div><div className="catalog-list"><span>AGUACATE HASS <b>KG</b></span><span>JITOMATE SALADETT <b>KG</b></span><span>CHILE GUAJILLO <b>KG</b></span><span>ARROZ A GRANEL <b>KG</b></span><span>FRESA 1A DOMO 500 GR <b>PZA</b></span></div></div></section>
  </main>;
}
