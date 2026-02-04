"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Har bir category uchun productlar
const products = [
  // Pants
  {
    category: "pants",
    slug: "red-pants",
    title: "Red Pants test",
    price: "$20",
    src: "/product-pants.png",
    colors: ["Red", "Blue"],
    sizes: ["S", "M", "L"],
  },
  {
    category: "pants",
    slug: "blue-pants",
    title: "Blue Pants",
    price: "$22",
    src: "/product-pants2.png",
    colors: ["Blue", "Green"],
    sizes: ["M", "L", "XL"],
  },
  {
    category: "pants",
    slug: "green-pants",
    title: "Green Pants",
    price: "$25",
    src: "/product-pants3.png",
    colors: ["Green"],
    sizes: ["S", "M"],
  },
  {
    category: "pants",
    slug: "yellow-pants",
    title: "Yellow Pants",
    price: "$18",
    src: "/product-pants4.png",
    colors: ["Yellow", "Red"],
    sizes: ["S", "M", "L"],
  },

  // Shoes
  {
    category: "shoes",
    slug: "red-shoes",
    title: "Red Shoes",
    price: "$30",
    src: "/product-shoes.png",
    colors: ["Red"],
    sizes: ["M", "L"],
  },
  {
    category: "shoes",
    slug: "blue-shoes",
    title: "Blue Shoes",
    price: "$35",
    src: "/product-shoes2.png",
    colors: ["Blue"],
    sizes: ["S", "M", "L"],
  },
  {
    category: "shoes",
    slug: "green-shoes",
    title: "Green Shoes",
    price: "$28",
    src: "/product-shoes3.png",
    colors: ["Green", "Blue"],
    sizes: ["L", "XL"],
  },
  {
    category: "shoes",
    slug: "yellow-shoes",
    title: "Yellow Shoes",
    price: "$32",
    src: "/product-shoes4.png",
    colors: ["Yellow"],
    sizes: ["S", "M"],
  },

  // Jackets
  {
    category: "jackets",
    slug: "red-jacket",
    title: "Red Jacket",
    price: "$45",
    src: "/product-jacket.png",
    colors: ["Red"],
    sizes: ["S", "M", "L"],
  },
  {
    category: "jackets",
    slug: "blue-jacket",
    title: "Blue Jacket",
    price: "$50",
    src: "/product-jacket2.png",
    colors: ["Blue", "Green"],
    sizes: ["M", "L", "XL"],
  },
  {
    category: "jackets",
    slug: "green-jacket",
    title: "Green Jacket",
    price: "$48",
    src: "/product-jacket3.png",
    colors: ["Green"],
    sizes: ["S", "M"],
  },
  {
    category: "jackets",
    slug: "yellow-jacket",
    title: "Yellow Jacket",
    price: "$42",
    src: "/product-jacket4.png",
    colors: ["Yellow", "Red"],
    sizes: ["S", "M", "L"],
  },

  // Accessories
  {
    category: "accessories",
    slug: "red-hat",
    title: "Red Hat",
    price: "$15",
    src: "/product-hat.png",
    colors: ["Red", "Yellow"],
    sizes: ["S", "M"],
  },
  {
    category: "accessories",
    slug: "blue-hat",
    title: "Blue Hat",
    price: "$18",
    src: "/product-hat2.png",
    colors: ["Blue"],
    sizes: ["M", "L"],
  },
  {
    category: "accessories",
    slug: "green-scarf",
    title: "Green Scarf",
    price: "$12",
    src: "/product-scarf.png",
    colors: ["Green"],
    sizes: ["S", "M"],
  },
  {
    category: "accessories",
    slug: "yellow-scarf",
    title: "Yellow Scarf",
    price: "$14",
    src: "/product-scarf2.png",
    colors: ["Yellow"],
    sizes: ["M", "L"],
  },
];

export default function CategoryProductsPage() {
  const { slug } = useParams(); // URL dan category slug olamiz
  const router = useRouter();
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Faqat shu category mahsulotlarini filter qilamiz
  const filteredByCategory = products.filter((p) => p.category === slug);

  // Size va color filter
  const finalProducts = filteredByCategory.filter((p) => {
    const sizeMatch =
      selectedSizes.length === 0 || selectedSizes.some((s) => p.sizes.includes(s));
    const colorMatch =
      selectedColors.length === 0 || selectedColors.some((c) => p.colors.includes(c));
    return sizeMatch && colorMatch;
  });

  return (
    <main className="bg-gradient-to-b from-pink-50 to-blue-50 min-h-screen text-gray-900 px-6 md:px-16 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-pink-700">
        {slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : ""} Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* FILTER */}
        <aside className="bg-white rounded-2xl shadow-md p-6 h-fit">
          <h3 className="font-bold text-lg mb-4 text-pink-700">Size</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() =>
                  setSelectedSizes(
                    selectedSizes.includes(size)
                      ? selectedSizes.filter((s) => s !== size)
                      : [...selectedSizes, size]
                  )
                }
                className={`px-4 py-2 rounded-full border transition ${
                  selectedSizes.includes(size)
                    ? "bg-pink-400 text-white border-pink-400"
                    : "border-gray-300 hover:bg-pink-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <h3 className="font-bold text-lg mb-4 text-pink-700">Color</h3>
          <div className="flex gap-3 flex-wrap">
            {["Red", "Blue", "Green", "Yellow"].map((c) => (
              <button
                key={c}
                onClick={() =>
                  setSelectedColors(
                    selectedColors.includes(c)
                      ? selectedColors.filter((col) => col !== c)
                      : [...selectedColors, c]
                  )
                }
                className={`w-9 h-9 rounded-full border-2 transition ${
                  selectedColors.includes(c) ? "border-black scale-110" : "border-white"
                }`}
                style={{ backgroundColor: c.toLowerCase() }}
              />
            ))}
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {finalProducts.map((product) => (
            <div
              key={product.slug}
              onClick={() =>
                router.push(`/categories/products/${product.category}/${product.slug}`)
              }
              className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transform hover:-translate-y-1 transition cursor-pointer"
            >
              <div className="w-32 h-32 mx-auto mb-4">
                <img
                  src={product.src}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
              <p className="text-pink-700 font-bold">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
