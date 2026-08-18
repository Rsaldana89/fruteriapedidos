"use client";

import { Check, Minus, Plus, Search, ShoppingBasket } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product, ProductCategory } from "@/src/types/catalog";
import { useCart } from "../providers";

const categories: Array<"Todos" | ProductCategory> = [
  "Todos",
  "Frutas y verduras",
  "Abarrotes",
  "Granos y semillas",
  "Chiles secos",
  "Otros",
];
const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

function ProductRow({ product, showPrices }: { product: Product; showPrices: boolean }) {
  const { add } = useCart();
  const step = /KG/i.test(product.unit) ? 0.5 : 1;
  const [quantity, setQuantity] = useState(step);
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    add(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };
  return (
    <article className="product-card">
      <div className="product-heading"><span className="product-dot" aria-hidden="true" /><div><h3>{product.name}</h3><span>{product.category}</span></div></div>
      <div className="product-meta"><div><small>Unidad</small><strong>{product.unit}</strong></div>{showPrices ? <div><small>Precio</small><strong>{money.format(product.price)}</strong></div> : <div><small>Precio</small><strong>A cotizar</strong></div>}</div>
      <div className="add-row">
        <div className="quantity-control"><button type="button" onClick={() => setQuantity(Math.max(step, quantity - step))} aria-label="Reducir cantidad"><Minus size={15} /></button><input type="number" min={step} max="10000" step={step} value={quantity} onChange={(e) => setQuantity(Math.max(step, Number(e.target.value) || step))} aria-label={`Cantidad de ${product.name}`} /><button type="button" onClick={() => setQuantity(quantity + step)} aria-label="Aumentar cantidad"><Plus size={15} /></button></div>
        <button className={`add-button ${added ? "is-added" : ""}`} type="button" onClick={handleAdd}>{added ? <><Check size={17} /> Agregado</> : <><ShoppingBasket size={17} /> Agregar</>}</button>
      </div>
    </article>
  );
}

export function ProductCatalog({ products, showPrices }: { products: Product[]; showPrices: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const filtered = useMemo(() => {
    const normalized = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "Todos" || product.category === category;
      const name = product.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return matchesCategory && name.includes(normalized);
    });
  }, [products, query, category]);

  return (
    <div className="catalog-app">
      <div className="catalog-toolbar">
        <label className="search-box"><Search size={20} aria-hidden="true" /><span className="sr-only">Buscar productos</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar aguacate, chile, arroz…" /></label>
        <div className="category-scroll" aria-label="Filtrar por categoría">
          {categories.map((item) => <button type="button" className={item === category ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}
        </div>
      </div>
      <div className="catalog-count"><strong>{filtered.length}</strong> productos encontrados{!showPrices && <span> · Precios disponibles por cotización</span>}</div>
      {filtered.length > 0 ? <div className="product-grid">{filtered.map((product) => <ProductRow key={product.id} product={product} showPrices={showPrices} />)}</div> : <div className="no-results"><Search size={36} /><h3>No encontramos ese producto</h3><p>Prueba otra palabra o categoría. También puedes consultarnos directamente por WhatsApp.</p></div>}
    </div>
  );
}
