"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBasket, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../providers";

const nav = [
  ["Inicio", "/"],
  ["Nosotros", "/#nosotros"],
  ["Servicios", "/#servicios"],
  ["Productos", "/productos"],
  ["Contacto", "/contacto"],
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, open } = useCart();
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="ABF Maxi Alimentos, inicio">
          <Image
            src="/brand/abf-logo-clean.webp"
            alt="ABF Maxi Alimentos"
            width={74}
            height={82}
            priority
            unoptimized
          />
          <span><strong>ABF</strong><small>Maxi Alimentos</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <button className="cart-button" type="button" onClick={open} aria-label={`Abrir mi pedido. ${itemCount} productos`}>
            <ShoppingBasket size={19} aria-hidden="true" />
            <span>Mi pedido</span>
            {itemCount > 0 && <b>{itemCount}</b>}
          </button>
          <Link className="button button-primary header-cta" href="/pedido">Hacer pedido</Link>
          <button className="menu-button" type="button" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Navegación móvil">
          {nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
          <Link className="button button-primary" href="/pedido" onClick={() => setMenuOpen(false)}>Hacer pedido</Link>
        </nav>
      )}
    </header>
  );
}
