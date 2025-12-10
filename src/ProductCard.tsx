export default function ProductCard({ product }: { product: Product }) {
  const fallback = "/placeholder.png"; // add a placeholder in public/
  const stockBadge = product.stock === 0 ? "Out" : product.stock <= 10 ? "Low" : "In";

  const discountedPrice = Math.round(product.price * (1 - (product.discountPercentage || 0) / 100));

  return (
    <div className="border rounded p-3 flex flex-col">
      <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={product.thumbnail || fallback}
          alt={product.title}
          onError={(e) => (e.currentTarget.src = fallback)}
          className="h-full object-cover"
        />
      </div>

      <div className="mt-2 flex-1">
        <h3 className="font-semibold text-sm">{product.title}</h3>
        <div className="text-xs text-gray-500">{product.brand}</div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="font-bold">₹{discountedPrice}</div>
          {product.discountPercentage ? (
            <div className="text-xs text-green-600">{product.discountPercentage}% off</div>
          ) : null}
        </div>
        <div className="text-right">
          <RatingStars rating={product.rating} />
          <div
            className={`text-xs mt-1 px-2 py-0.5 rounded ${
              stockBadge === "Out"
                ? "bg-red-100 text-red-700"
                : stockBadge === "Low"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {stockBadge}
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="flex-1 border rounded py-1">View</button>
        <button className="flex-1 bg-black text-white rounded py-1">Add</button>
      </div>
    </div>
  );
}

function RatingStars({ rating = 0 }: { rating?: number }) {
  return <div className="text-sm">★ {rating.toFixed(1)}</div>;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
