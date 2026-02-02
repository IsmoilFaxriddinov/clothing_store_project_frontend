"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const products = [
  // Pants
  {
    category: "pants",
    slug: "red-pants",
    title: "Red Pants",
    price: "$20",
    image: "/product-pants.png",
    description: "Comfortable red pants for kids. Soft and stylish.",
    colors: ["Red", "Blue"],
    sizes: ["S", "M", "L"],
  },
  {
    category: "pants",
    slug: "blue-pants",
    title: "Blue Pants",
    price: "$22",
    image: "/product-pants2.png",
    description: "Classic blue pants for kids. Durable and comfy.",
    colors: ["Blue", "Green"],
    sizes: ["M", "L", "XL"],
  },
  // (shu yerda boshqa products ham qoladi)
];

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const product = products.find(
    (p) => p.category === params.slug && p.slug === params.productSlug
  );

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500 text-xl">
        Product not found
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Please select a color and size!");
      return;
    }
    alert(
      `Added ${product.title} - Color: ${selectedColor}, Size: ${selectedSize} to cart!`
    );
    router.push("/products");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-6 md:p-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* IMAGE */}
        <div className="bg-white rounded-3xl shadow-lg p-4 flex justify-center items-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl"
          />
        </div>

        {/* INFO */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-700 mb-4">
            {product.title}
          </h1>
          <p className="text-2xl font-semibold text-gray-800 mb-4">
            {product.price}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* COLORS */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-900">Colors</h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition transform hover:scale-110 ${
                    selectedColor === color
                      ? "ring-2 ring-pink-600"
                      : "opacity-80"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-900">Sizes</h3>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg font-semibold transition ${
                    selectedSize === size
                      ? "bg-pink-600 text-white border-pink-600"
                      : "border-gray-300 text-gray-900 hover:bg-pink-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700 transition transform hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
