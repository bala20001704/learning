export async function getProducts({ limit = 30, skip = 0 }: { limit?: number; skip?: number }) {
  const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json(); // shape: { products: Product[], total, skip, limit }
}
