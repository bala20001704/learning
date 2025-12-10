import { useEffect, useState } from "react";
import ProductCard, { type Product } from "./ProductCard";
import { getProducts } from "./services";
import { useProducts } from "./hooks";

const DUMMY = [
  { id: 1, title: "Sneaker A", price: 2999, brand: "BrandA" },
  { id: 2, title: "Shoe B", price: 1999, brand: "BrandB" },
  { id: 3, title: "Watch C", price: 4999, brand: "BrandC" },
];

export default function ProductsPage() {
  const { data, isLoading, error } = useProducts({ limit: 30, skip: 0 });

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.products.map((p: Product) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
