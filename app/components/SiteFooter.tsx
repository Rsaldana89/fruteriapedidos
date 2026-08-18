import Image from "next/image";
import Link from "next/link";
import { company } from "@/src/config/company";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/brand/abf-logo-clean.webp" alt="" width={82} height={110} unoptimized />
          <div><strong>{company.name}</strong><p>{company.slogan}</p></div>
        </div>
        <div><h3>Explora</h3><Link href="/#nosotros">Nosotros</Link><Link href="/#servicios">Servicios</Link><Link href="/productos">Productos</Link><Link href="/pedido">Hacer pedido</Link></div>
        <div><h3>Contacto</h3><a href={`tel:${company.phoneHref}`}>{company.phoneDisplay}</a><a href={`mailto:${company.email}`}>{company.email}</a><a href={company.instagramUrl} target="_blank" rel="noreferrer">{company.instagram}</a></div>
        <div><h3>Ubicación</h3><p>{company.address}</p><Link href="/aviso-de-privacidad">Aviso de privacidad</Link></div>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} ABF Maxi Alimentos</span><span>Abastecimiento en Querétaro</span></div>
    </footer>
  );
}
