import type { Metadata } from "next";
import productsData from "@/src/data/products.json";
import type { Product } from "@/src/types/catalog";
import { showPrices } from "@/src/config/company";
import { ProductCatalog } from "../components/ProductCatalog";

export const metadata: Metadata = {
  title: "Productos | ABF Maxi Alimentos",
  description: "Consulta el catálogo de frutas, verduras, abarrotes, granos, semillas y chiles secos de ABF.",
};

export default function ProductsPage() {
  return (
    <main>
      <section className="page-hero catalog-hero"><div className="shell"><span className="eyebrow">Catálogo ABF</span><h1>Lo que necesitas, en un pedido sencillo</h1><p>Busca entre {productsData.length} productos reales, indica cantidades y arma tu solicitud. ABF confirmará disponibilidad y condiciones de entrega.</p></div></section>
      <section className="section shell"><ProductCatalog products={productsData as Product[]} showPrices={showPrices} /></section>
    </main>
  );
}
