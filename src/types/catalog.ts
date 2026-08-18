export type ProductCategory =
  | "Frutas y verduras"
  | "Abarrotes"
  | "Granos y semillas"
  | "Chiles secos"
  | "Otros";

export type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  category: ProductCategory;
};

export type CartLine = Product & { quantity: number };
