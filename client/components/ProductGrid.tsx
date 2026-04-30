import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    image: "/ethnicwear.jpg",
    title: "Women's Ethnic Kurti with Elegant Embroidery",
    actualPrice: 2999,
    salePrice: 1499,
  },
  {
    id: 2,
    image: "/banner2.png",
    title: "Designer Women's Saree - Traditional Wear",
    actualPrice: 4999,
    salePrice: 2999,
  },
  {
    id: 3,
    image: "/banner3.png",
    title: "Casual Women's T-Shirt - Premium Cotton",
    actualPrice: 899,
    salePrice: 599,
  },
  {
    id: 4,
    image: "/banner4.png",
    title: "Women's Denim Jacket - Winter Collection",
    actualPrice: 3499,
    salePrice: 2199,
  },
  {
    id: 5,
    image: "/ethnicwear.jpg",
    title: "Stylish Women's Palazzo Set",
    actualPrice: 1899,
    salePrice: 999,
  },
  {
    id: 6,
    image: "/banner2.png",
    title: "Women's Party Wear Gown",
    actualPrice: 5999,
    salePrice: 3499,
  },
  {
    id: 7,
    image: "/banner3.png",
    title: "Comfortable Women's Jeggings",
    actualPrice: 1299,
    salePrice: 799,
  },
  {
    id: 8,
    image: "/banner4.png",
    title: "Women's Crop Top - Trendy Fashion",
    actualPrice: 799,
    salePrice: 499,
  },
  {
    id: 9,
    image: "/ethnicwear.jpg",
    title: "Women's Anarkali Suit - Festive Wear",
    actualPrice: 3999,
    salePrice: 2499,
  },
  {
    id: 10,
    image: "/banner2.png",
    title: "Women's High-Waist Jeans - Skinny Fit",
    actualPrice: 2499,
    salePrice: 1599,
  },
  {
    id: 11,
    image: "/banner3.png",
    title: "Women's Woolen Sweater - Winter Special",
    actualPrice: 1999,
    salePrice: 1299,
  },
  {
    id: 12,
    image: "/banner4.png",
    title: "Women's Formal Shirt - Office Wear",
    actualPrice: 1499,
    salePrice: 899,
  },
  {
    id: 13,
    image: "/ethnicwear.jpg",
    title: "Women's Lehenga Choli - Bridal Collection",
    actualPrice: 7999,
    salePrice: 4999,
  },
  {
    id: 14,
    image: "/banner2.png",
    title: "Women's Sports Bra - Active Wear",
    actualPrice: 699,
    salePrice: 399,
  },
  {
    id: 15,
    image: "/banner3.png",
    title: "Women's Maxi Dress - Summer Collection",
    actualPrice: 2199,
    salePrice: 1399,
  },
];

export default function ProductGrid() {
  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Trending Products
            </h2>
            <p className="text-gray-600">
              Discover our latest collection
            </p>
          </div>
          <button className="text-red-600 font-semibold hover:text-red-700 transition-colors">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
