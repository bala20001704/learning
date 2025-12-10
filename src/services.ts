export async function getProducts({ limit = 30, skip = 0 }: { limit?: number; skip?: number }) {
  const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json(); // shape: { products: Product[], total, skip, limit }
}

export async function getCategories() {
  const res = await fetch(`https://dummyjson.com/products/categories`);
  if (!res.ok) throw new Error("Failed to get categories");
  return res.json(); // returns string[]
}

export async function getProductsByCategory(category: string) {
  const res = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=30&skip=0`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}
