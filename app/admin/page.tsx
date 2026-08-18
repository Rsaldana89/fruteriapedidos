import type { Metadata } from "next";
import { isAdminConfigured } from "@/src/server/admin-session";
import { AdminPanel } from "../components/AdminPanel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administración | ABF Maxi Alimentos", robots: { index: false, follow: false } };
export default function AdminPage() { return <main className="admin-page"><section className="page-hero admin-hero"><div className="shell"><span className="eyebrow">Área privada</span><h1>Administración de pedidos</h1><p>Consulta solicitudes y actualiza su estado cuando MySQL esté conectado.</p></div></section><section className="section shell"><AdminPanel configured={isAdminConfigured()} /></section></main>; }
