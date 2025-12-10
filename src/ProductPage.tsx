import { useEffect, useState } from "react";
import ProductCard, { type Product } from "./ProductCard";
import { getProducts } from "./services";

const DUMMY = [
  { id: 1, title: "Sneaker A", price: 2999, brand: "BrandA" },
  { id: 2, title: "Shoe B", price: 1999, brand: "BrandB" },
  { id: 3, title: "Watch C", price: 4999, brand: "BrandC" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProducts({ limit: 30, skip: 0 })
      .then((data) => setProducts(data.products || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Products (gen0)</h1>
      {loading ? <div>Loading…</div> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
