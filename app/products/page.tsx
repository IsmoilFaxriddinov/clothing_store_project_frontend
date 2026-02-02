"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

// Products data with more details
const products = [
  { category: "pants", slug: "red-pants", title: "Red Pants", price: "$20", discount: "$15", rating: 4, src: "/product-pants.png", colors: ["Red", "Blue"], sizes: ["S", "M", "L"], new: true },
  { category: "pants", slug: "blue-pants", title: "Blue Pants", price: "$22", discount: "$18", rating: 5, src: "/product-pants2.png", colors: ["Blue", "Green"], sizes: ["M", "L", "XL"], new: false },
  { category: "pants", slug: "green-pants", title: "Green Pants", price: "$25", rating: 4, src: "/product-pants3.png", colors: ["Green"], sizes: ["S", "M"], new: false },
  { category: "shoes", slug: "red-shoes", title: "Red Shoes", price: "$30", discount: "$25", rating: 5, src: "/product-shoes.png", colors: ["Red"], sizes: ["M", "L"], new: true },
  { category: "shoes", slug: "blue-shoes", title: "Blue Shoes", price: "$35", rating: 4, src: "/product-shoes2.png", colors: ["Blue"], sizes: ["S", "M", "L"], new: false },
  { category: "jackets", slug: "green-jacket", title: "Green Jacket", price: "$48", discount: "$42", rating: 5, src: "/product-jacket3.png", colors: ["Green"], sizes: ["S", "M"], new: false },
  { category: "jackets", slug: "red-jacket", title: "Red Jacket", price: "$45", rating: 4, src: "/product-jacket.png", colors: ["Red"], sizes: ["S", "M", "L"], new: true },
  { category: "accessories", slug: "red-hat", title: "Red Hat", price: "$15", rating: 4, src: "/product-hat.png", colors: ["Red", "Yellow", "Blue"], sizes: ["S", "M"], new: true },
  { category: "accessories", slug: "blue-hat", title: "Blue Hat", price: "$18", discount: "$14", rating: 5, src: "/product-hat2.png", colors: ["Blue"], sizes: ["M", "L"], new: false },
];

export default function ProductsPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const router = useRouter();

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const finalProducts = products.filter((p) => {
    const slugMatch = !slug || p.category === slug;
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const sizeMatch = selectedSizes.length === 0 || selectedSizes.some((s) => p.sizes.includes(s));
    const colorMatch = selectedColors.length === 0 || selectedColors.some((c) => p.colors.includes(c));
    return slugMatch && categoryMatch && sizeMatch && colorMatch;
  });

  return (
    <main className="bg-gradient-to-b from-pink-50 to-blue-50 min-h-screen text-gray-900 px-6 md:px-16 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-pink-700">
        {slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "All"} Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* FILTER PANEL */}
        <aside className="bg-white rounded-3xl shadow-xl p-6 h-fit sticky top-24">
          {/* CATEGORY FILTER */}
          <h3 className="font-bold text-lg mb-4 text-pink-700">Category</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() =>
                  setSelectedCategories(
                    selectedCategories.includes(cat)
                      ? selectedCategories.filter((c) => c !== cat)
                      : [...selectedCategories, cat]
                  )
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full border capitalize transition font-semibold ${
                  selectedCategories.includes(cat)
                    ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white border-pink-500"
                    : "border-gray-300 hover:bg-pink-100"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* SIZE FILTER */}
          <h3 className="font-bold text-lg mb-4 text-pink-700">Size</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {["S", "M", "L", "XL"].map((size) => (
              <motion.button
                key={size}
                onClick={() =>
                  setSelectedSizes(
                    selectedSizes.includes(size)
                      ? selectedSizes.filter((s) => s !== size)
                      : [...selectedSizes, size]
                  )
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full border transition font-semibold ${
                  selectedSizes.includes(size)
                    ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white border-pink-500"
                    : "border-gray-300 hover:bg-pink-100"
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>

          {/* COLOR FILTER */}
          <h3 className="font-bold text-lg mb-4 text-pink-700">Color</h3>
          <div className="flex gap-3 flex-wrap">
            {["Red", "Blue", "Green", "Yellow"].map((c) => (
              <motion.button
                key={c}
                onClick={() =>
                  setSelectedColors(
                    selectedColors.includes(c)
                      ? selectedColors.filter((col) => col !== c)
                      : [...selectedColors, c]
                  )
                }
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`w-9 h-9 rounded-full border-2 transition shadow-md ${
                  selectedColors.includes(c) ? "border-black scale-110" : "border-gray-200"
                }`}
                style={{ backgroundColor: c.toLowerCase() }}
              />
            ))}
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {finalProducts.map((product) => (
            <motion.div
              key={product.slug}
              onClick={() =>
                router.push(`/categories/products/${product.category}/${product.slug}`)
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-3xl shadow-lg p-6 text-center cursor-pointer overflow-hidden relative group"
            >
              {product.new && (
                <span className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 text-xs rounded-full font-bold z-10">
                  NEW
                </span>
              )}

              <div className="w-full h-64 mx-auto mb-4 relative">
                <img
                  src={product.src}
                  alt={product.title}
                  className="w-full h-full object-contain rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-inner"
                />
              </div>

              <h3 className="font-bold text-lg mb-2">{product.title}</h3>

              <div className="flex justify-center items-center gap-2 mb-2">
                <span className="text-pink-700 font-extrabold text-xl">
                  {product.discount ? product.discount : product.price}
                </span>
                {product.discount && (
                  <span className="text-gray-400 line-through">{product.price}</span>
                )}
              </div>

              {/* RATING */}
              <div className="flex justify-center mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`text-yellow-400 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
              </div>

              {/* COLORS */}
              <div className="flex justify-center items-center gap-2 flex-wrap mb-4">
                {product.colors.map((color, idx) => idx < 4 && (
                  <span
                    key={color}
                    className="w-6 h-6 rounded-full border border-gray-200 shadow-inner"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  ></span>
                ))}
                {product.colors.length > 4 && (
                  <span className="text-gray-500 text-sm">+{product.colors.length - 4}</span>
                )}
              </div>

              {/* ADD TO CART */}
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold transition transform hover:scale-105">
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
