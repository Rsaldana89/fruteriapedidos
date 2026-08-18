"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Database, LogOut, RefreshCw, Search, ShieldCheck } from "lucide-react";

type OrderRow = { id: number; orderNumber: string; createdAt: string; customerName: string; companyName?: string; phone: string; total?: number; status: string };
const labels: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmado", preparing: "En preparación", delivered: "Entregado", cancelled: "Cancelado" };

export function AdminPanel({ configured }: { configured: boolean }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [databaseConfigured, setDatabaseConfigured] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const params = new URLSearchParams(); if (query) params.set("q", query); if (status) params.set("status", status);
    const response = await fetch(`/api/admin/orders?${params}`);
    if (response.status === 401) { setAuthenticated(false); return; }
    const data = await response.json(); setAuthenticated(true); setDatabaseConfigured(data.databaseConfigured); setOrders(data.orders || []); setMessage(data.error || "");
  }, [query, status]);
  useEffect(() => { if (!configured) return; const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [configured, load]);
  async function login(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ user: form.get("user"), password: form.get("password") }) }); const data = await response.json(); if (!response.ok) { setMessage(data.error); return; } setMessage(""); await load(); }
  async function changeStatus(id: number, nextStatus: string) { await fetch("/api/admin/orders", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status: nextStatus }) }); await load(); }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setAuthenticated(false); }

  if (!configured) return <div className="admin-empty"><ShieldCheck size={50} /><h2>Acceso administrativo no configurado</h2><p>Define las variables de administrador indicadas en el README. El sitio público y los pedidos por WhatsApp siguen funcionando con normalidad.</p></div>;
  if (!authenticated) return <form className="admin-login" onSubmit={login}><ShieldCheck size={42} /><h2>Acceso ABF</h2><p>Ingresa las credenciales administrativas.</p><label>Usuario<input name="user" required autoComplete="username" /></label><label>Contraseña<input name="password" type="password" required autoComplete="current-password" /></label>{message && <p className="login-error">{message}</p>}<button className="button button-primary button-wide">Ingresar</button></form>;
  return <div className="admin-panel"><div className="admin-toolbar"><div><span className={`db-status ${databaseConfigured ? "connected" : ""}`}><Database size={16} /> {databaseConfigured ? "Base de datos configurada" : "Base de datos desactivada"}</span><h2>Pedidos recibidos</h2></div><button className="text-button" type="button" onClick={logout}><LogOut size={17} /> Cerrar sesión</button></div><div className="admin-filters"><label><Search size={17} /><input placeholder="Buscar folio o cliente" value={query} onChange={(e) => setQuery(e.target.value)} /></label><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos los estados</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button type="button" onClick={load}><RefreshCw size={17} /> Actualizar</button></div>{message && <p className="login-error">{message}</p>}{!databaseConfigured ? <div className="admin-empty compact"><Database size={40} /><h3>Conecta MySQL para consultar pedidos</h3><p>Consulta el README para crear las tablas y definir DATABASE_URL.</p></div> : orders.length === 0 ? <div className="admin-empty compact"><h3>No hay pedidos con estos filtros</h3></div> : <div className="order-table-wrap"><table><thead><tr><th>Folio</th><th>Fecha</th><th>Cliente</th><th>Teléfono</th><th>Total</th><th>Estado</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.orderNumber}</strong></td><td>{new Date(order.createdAt).toLocaleDateString("es-MX")}</td><td>{order.customerName}<small>{order.companyName}</small></td><td><a href={`https://wa.me/${order.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{order.phone}</a></td><td>{order.total == null ? "—" : Number(order.total).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</td><td><select value={order.status} onChange={(e) => changeStatus(order.id, e.target.value)}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td></tr>)}</tbody></table></div>}</div>;
}
