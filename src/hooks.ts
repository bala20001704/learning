import { useInfiniteQuery, useQuery, type InfiniteData } from "@tanstack/react-query";
import { getProducts } from "./services";
import type { Product } from "./ProductCard";

export function useProducts({ limit = 30, skip = 0 }) {
  return useQuery({
    queryKey: ["products", limit, skip],
    queryFn: () => getProducts({ limit, skip }),
  });
}

export function useProductsInfinite() {
  return useInfiniteQuery<ProductsResponse, Error, InfiniteData<ProductsResponse>, ["products", "infinite"], number>({
    queryKey: ["products", "infinite"],
    queryFn: ({ pageParam = 0 }) => getProducts({ limit: 30, skip: pageParam }),
    getNextPageParam: (lastPage, totalPages) => {
      if (lastPage.products.length < lastPage.limit) {
        return undefined;
      }
      return totalPages.length * 30;
    },

    initialPageParam: 0,
  });
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
