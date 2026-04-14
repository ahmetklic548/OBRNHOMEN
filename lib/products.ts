import productsData from "@/data/products.json";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  currency: string;
  stock: number;
  inStock: boolean;
  color: string | null;
  size: string | null;
  features: string[];
  images: string[];
  metaDescription: string;
}

const products = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(products.map((p) => p.category))].sort();
}

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}
