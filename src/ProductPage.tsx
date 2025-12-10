import { useEffect, useRef, useState } from "react";
import ProductCard, { type Product } from "./ProductCard";
import { getProducts } from "./services";
import { useProducts, useProductsInfinite } from "./hooks";

const DUMMY = [
  { id: 1, title: "Sneaker A", price: 2999, brand: "BrandA" },
  { id: 2, title: "Shoe B", price: 1999, brand: "BrandB" },
  { id: 3, title: "Watch C", price: 4999, brand: "BrandC" },
];

export default function ProductsPage() {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, status } = useProductsInfinite();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (status === "pending") return <div>Loading…</div>;
  if (status === "error") return <div>Error</div>;

  const items = data.pages.flatMap((p: any) => p.products);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((p: Product) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-10 flex items-center justify-center mt-6">
        {isFetchingNextPage ? "Loading more…" : hasNextPage ? "Scroll to load more" : "No more products"}
      </div>
    </div>
  );
}
