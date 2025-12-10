import { useInfiniteQuery, useQuery, type InfiniteData } from "@tanstack/react-query";
import { getCategories, getProducts, getProductsByCategory } from "./services";
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
