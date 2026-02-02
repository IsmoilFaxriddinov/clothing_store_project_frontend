"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

// Products data (short version, lekin similar products ham shu arraydan ishlatiladi)
const products = [
  {
    category: "pants",
    slug: "red-pants",
    title: "Red Pants",
    price: "$20",
    discount: "$15",
    image: "/product-pants.png",
    description: "Comfortable red pants for kids. Soft and stylish.",
    colors: ["Red", "Blue"],
    sizes: ["S", "M", "L"],
    material: "Cotton",
    weight: "200g",
    ageGroup: "3-8 years",
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
    material: "Cotton Blend",
    weight: "220g",
    ageGroup: "4-9 years",
  },
  {
    category: "shoes",
    slug: "red-shoes",
    title: "Red Shoes",
    price: "$30",
    discount: "$25",
    image: "/product-shoes.png",
    description: "Stylish red shoes for daily wear.",
    colors: ["Red"],
    sizes: ["M", "L"],
    material: "Synthetic",
    weight: "300g",
    ageGroup: "3-10 years",
  },
  {
    category: "jackets",
    slug: "blue-jacket",
    title: "Blue Jacket",
    price: "$50",
    image: "/product-jacket2.png",
    description: "Warm and comfy jacket for kids.",
    colors: ["Blue", "Green"],
    sizes: ["M", "L", "XL"],
    material: "Polyester",
    weight: "500g",
    ageGroup: "5-12 years",
  },
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

  // Similar products (same category, excluding current)
  const similarProducts = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-6 md:p-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* IMAGE */}
        <div className="bg-white rounded-3xl shadow-lg p-4 flex justify-center items-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl"
          />
        </div>

        {/* INFO */}
        <div className="flex flex-col justify-start">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-700 mb-2">
            {product.title}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-extrabold text-pink-700">
              {product.discount ? product.discount : product.price}
            </span>
            {product.discount && (
              <span className="text-gray-400 line-through">{product.price}</span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Extra info */}
          <div className="mb-6 grid grid-cols-2 gap-4 text-gray-800">
            <div>
              <span className="font-semibold">Material: </span>{product.material}
            </div>
            <div>
              <span className="font-semibold">Weight: </span>{product.weight}
            </div>
            <div>
              <span className="font-semibold">Age Group: </span>{product.ageGroup}
            </div>
          </div>

          {/* COLORS */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-900">Colors</h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition transform hover:scale-110 ${
                    selectedColor === color ? "ring-2 ring-pink-600" : "opacity-80"
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

      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-pink-700 mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {similarProducts.map((sp) => (
              <motion.div
                key={sp.slug}
                onClick={() =>
                  router.push(`/categories/products/${sp.category}/${sp.slug}`)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-3xl shadow-lg p-4 text-center cursor-pointer"
              >
                <div className="w-full h-40 mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={sp.image}
                    alt={sp.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{sp.title}</h3>
                <div className="flex justify-center items-center gap-2">
                  <span className="text-pink-700 font-bold">
                    {sp.discount ? sp.discount : sp.price}
                  </span>
                  {sp.discount && (
                    <span className="text-gray-400 line-through">{sp.price}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
