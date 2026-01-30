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
  {
    category: "pants",
    slug: "green-pants",
    title: "Green Pants",
    price: "$25",
    image: "/product-pants3.png",
    description: "Soft green pants with adjustable waist. Perfect for school.",
    colors: ["Green"],
    sizes: ["S", "M"],
  },
  {
    category: "pants",
    slug: "yellow-pants",
    title: "Yellow Pants",
    price: "$18",
    image: "/product-pants4.png",
    description: "Bright yellow pants. Fun and comfy for kids.",
    colors: ["Yellow", "Red"],
    sizes: ["S", "M", "L"],
  },

  // Shoes
  {
    category: "shoes",
    slug: "red-shoes",
    title: "Red Shoes",
    price: "$30",
    image: "/product-shoes.png",
    description: "Stylish red shoes for kids. Comfortable and lightweight.",
    colors: ["Red", "Black"],
    sizes: ["28", "29", "30"],
  },
  {
    category: "shoes",
    slug: "blue-shoes",
    title: "Blue Shoes",
    price: "$35",
    image: "/product-shoes2.png",
    description: "Trendy blue shoes. Perfect for daily wear.",
    colors: ["Blue"],
    sizes: ["28", "29", "30"],
  },
  {
    category: "shoes",
    slug: "green-shoes",
    title: "Green Shoes",
    price: "$28",
    image: "/product-shoes3.png",
    description: "Lightweight green shoes for active kids.",
    colors: ["Green", "Blue"],
    sizes: ["29", "30", "31"],
  },
  {
    category: "shoes",
    slug: "yellow-shoes",
    title: "Yellow Shoes",
    price: "$32",
    image: "/product-shoes4.png",
    description: "Bright yellow shoes. Fun for playtime.",
    colors: ["Yellow"],
    sizes: ["28", "29"],
  },

  // Jackets
  {
    category: "jackets",
    slug: "red-jacket",
    title: "Red Jacket",
    price: "$45",
    image: "/product-jacket.png",
    description: "Warm red jacket for kids. Soft and cozy.",
    colors: ["Red"],
    sizes: ["S", "M", "L"],
  },
  {
    category: "jackets",
    slug: "blue-jacket",
    title: "Blue Jacket",
    price: "$50",
    image: "/product-jacket2.png",
    description: "Blue jacket with hood. Stylish and comfortable.",
    colors: ["Blue", "Green"],
    sizes: ["M", "L", "XL"],
  },
  {
    category: "jackets",
    slug: "green-jacket",
    title: "Green Jacket",
    price: "$48",
    image: "/product-jacket3.png",
    description: "Soft green jacket. Great for winter days.",
    colors: ["Green"],
    sizes: ["S", "M"],
  },
  {
    category: "jackets",
    slug: "yellow-jacket",
    title: "Yellow Jacket",
    price: "$42",
    image: "/product-jacket4.png",
    description: "Bright yellow jacket. Fun and warm.",
    colors: ["Yellow", "Red"],
    sizes: ["S", "M", "L"],
  },

  // Accessories
  {
    category: "accessories",
    slug: "red-hat",
    title: "Red Hat",
    price: "$15",
    image: "/product-hat.png",
    description: "Cute red hat for kids. Soft and stylish.",
    colors: ["Red", "Yellow"],
    sizes: ["S", "M"],
  },
  {
    category: "accessories",
    slug: "blue-hat",
    title: "Blue Hat",
    price: "$18",
    image: "/product-hat2.png",
    description: "Blue hat for daily wear. Comfortable.",
    colors: ["Blue"],
    sizes: ["M", "L"],
  },
  {
    category: "accessories",
    slug: "green-scarf",
    title: "Green Scarf",
    price: "$12",
    image: "/product-scarf.png",
    description: "Warm green scarf. Soft fabric.",
    colors: ["Green"],
    sizes: ["S", "M"],
  },
  {
    category: "accessories",
    slug: "yellow-scarf",
    title: "Yellow Scarf",
    price: "$14",
    image: "/product-scarf2.png",
    description: "Bright yellow scarf. Fun and cozy.",
    colors: ["Yellow"],
    sizes: ["M", "L"],
  },
];

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();

  const product = products.find(
    (p) => p.category === params.slug && p.slug === params.productSlug
  );

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500 text-xl">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10 bg-gradient-to-b from-pink-50 to-blue-50 min-h-screen">
      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-[400px] md:h-[500px] rounded-2xl object-cover"
      />

      {/* INFO */}
      <div>
        <h1 className="text-4xl font-bold text-pink-700">{product.title}</h1>
        <p className="text-2xl text-gray-800 font-semibold mt-2">{product.price}</p>
        <p className="text-gray-600 mt-4">{product.description}</p>

        {/* COLORS */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-gray-900">Colors</h3>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                className="px-3 py-1 rounded-full text-white font-semibold"
                style={{ backgroundColor: color.toLowerCase() }}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* SIZES */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-gray-900">Sizes</h3>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                className="px-3 py-1 border rounded-md text-gray-900 font-semibold"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          className="mt-8 bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
          onClick={() => router.push("/categories")}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
