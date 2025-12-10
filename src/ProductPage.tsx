import { useEffect, useRef, useState } from "react";
import ProductCard, { type Product } from "./ProductCard";
import { getProducts } from "./services";
import {
  useCategories,
  useDebounce,
  useProductFilters,
  useProducts,
  useProductsInfinite,
  useSearchProductsInfinite,
} from "./hooks";
import { applyClientFilters } from "./utils";

const DUMMY = [
  { id: 1, title: "Sneaker A", price: 2999, brand: "BrandA" },
  { id: 2, title: "Shoe B", price: 1999, brand: "BrandB" },
  { id: 3, title: "Watch C", price: 4999, brand: "BrandC" },
];

export default function ProductsPage() {
  const filters = useProductFilters();
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 300);

  const { data, hasNextPage, fetchNextPage } = useProductsInfinite(); // assume base dataset for simplicity
  const items = data?.pages.flatMap((p: any) => p.products) ?? [];

  const shown = applyClientFilters(items, filters);

  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data: cats } = useCategories();

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

  console.log("category", cats);

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 mb-4">
        {/* Price range control (simple) */}
        <div>
          <label className="block text-xs">Min price</label>
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => filters.setPriceRange([Number(e.target.value), filters.priceRange[1]])}
            className="border p-1 rounded w-24"
          />
        </div>
        <div>
          <label className="block text-xs">Max price</label>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => filters.setPriceRange([filters.priceRange[0], Number(e.target.value)])}
            className="border p-1 rounded w-24"
          />
        </div>
        <div>
          <label className="block text-xs">Min rating</label>
          <select
            value={filters.minRating}
            onChange={(e) => filters.setMinRating(Number(e.target.value))}
            className="border p-1 rounded"
          >
            <option value={0}>Any</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
          </select>
        </div>
        <div>
          <label className="block text-xs">Stock</label>
          <select
            value={filters.stockStatus}
            onChange={(e) => filters.setStockStatus(e.target.value as any)}
            className="border p-1 rounded"
          >
            <option value="all">All</option>
            <option value="in">In stock</option>
            <option value="low">Low</option>
            <option value="out">Out</option>
          </select>
        </div>
        <div>
          <label className="block text-xs">Sort</label>
          <select
            value={filters.sort}
            onChange={(e) => filters.setSort(e.target.value as any)}
            className="border p-1 rounded"
          >
            <option value="price_asc">Price (low-high)</option>
            <option value="price_desc">Price (high-low)</option>
            <option value="rating">Rating</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {shown.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {shown.length === 0 && <div className="mt-8 text-center">No products match your filters</div>}
    </div>
  );
}
