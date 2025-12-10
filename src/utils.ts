export function applyClientFilters(products: any[], { priceRange, minRating, stockStatus, sort }: any) {
  let out = products.filter((p) => {
    const priceOk = p.price >= priceRange[0] && p.price <= priceRange[1];
    const ratingOk = (p.rating || 0) >= minRating;
    const stock = p.stock || 0;
    const stockOk =
      stockStatus === "all"
        ? true
        : stockStatus === "in"
        ? stock > 10
        : stockStatus === "low"
        ? stock > 0 && stock <= 10
        : stock === 0;

    return priceOk && ratingOk && stockOk;
  });

  if (sort === "price_asc") out = out.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") out = out.sort((a, b) => b.price - a.price);
  if (sort === "rating") out = out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === "title") out = out.sort((a, b) => a.title.localeCompare(b.title));

  return out;
}
