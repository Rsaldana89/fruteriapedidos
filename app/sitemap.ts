import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL || "https://abf-alimentos.example.com"; return ["", "/productos", "/pedido", "/contacto", "/aviso-de-privacidad"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "/productos" ? "weekly" : "monthly" })); }
