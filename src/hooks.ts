import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./services";

export function useProducts({ limit = 30, skip = 0 }) {
  return useQuery({
    queryKey: ["products", limit, skip],
    queryFn: () => getProducts({ limit, skip }),
  });
}
