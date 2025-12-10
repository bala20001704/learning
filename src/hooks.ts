import { useInfiniteQuery, useQuery, type InfiniteData } from "@tanstack/react-query";
import { getCategories, getProducts, getProductsByCategory, searchProducts } from "./services";
import type { Product } from "./ProductCard";

export function useProducts({ limit = 30, skip = 0 }) {
  return useQuery({
    queryKey: ["products", limit, skip],
    queryFn: () => getProducts({ limit, skip }),
  });
}

export function useProductsInfinite({ category, search }: { category?: string; search?: string } = {}) {
  return useInfiniteQuery<
    ProductsResponse,
    Error,
    InfiniteData<ProductsResponse>,
    ["products", "infinite", string, string],
    number
  >({
    queryKey: ["products", "infinite", category || "all", search || ""],
    queryFn: ({ pageParam = 0 }) => {
      if (category) {
        return getProductsByCategory(category);
      }
      //we will search handler late here now not added only category handled
      return getProducts({ limit: 30, skip: pageParam });
    },
    getNextPageParam: (lastPage, totalPages) => {
      if (lastPage.products.length < lastPage.limit) {
        return undefined;
      }
      return totalPages.length * 30;
    },

    initialPageParam: 0,
  });
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export const useCategories = () => useQuery<Category[], Error>({ queryKey: ["categories"], queryFn: getCategories });

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export function useSearchProductsInfinite(search?: string) {
  return useInfiniteQuery<
    ProductsResponse,
    Error,
    InfiniteData<ProductsResponse>,
    ["products", "search", string],
    number
  >({
    queryKey: ["products", "search", search || "all"],

    queryFn: ({ pageParam = 0 }) => searchProducts(search || "", { skip: pageParam }),

    enabled: !!search,

    getNextPageParam: (lastPage) => {
      const next = lastPage.skip + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },

    initialPageParam: 0,
  });
}

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 5000) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export type StockStatus = "all" | "in" | "low" | "out";
export type SortOption = "price_asc" | "price_desc" | "rating" | "title";

export function useProductFilters(initial = {}) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [stockStatus, setStockStatus] = useState<StockStatus>("all");
  const [sort, setSort] = useState<SortOption>("price_asc");

  return {
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    stockStatus,
    setStockStatus,
    sort,
    setSort,
  };
}
