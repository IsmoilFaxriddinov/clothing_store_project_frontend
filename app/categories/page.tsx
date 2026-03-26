"use client";

import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    { title: "Pants", slug: "pants", src: "/category-pants.png", color: "bg-yellow-100" },
    { title: "Shoes", slug: "shoes", src: "/category-shoes.png", color: "bg-green-100" },
    { title: "Jackets", slug: "jackets", src: "/category-jackets.png", color: "bg-blue-100" },
    { title: "Accessories", slug: "accessories", src: "/category-accessories.png", color: "bg-pink-100" },
  ];

  return (
    <main className="bg-gradient-to-b from-pink-50 to-blue-50 min-h-screen text-gray-900">
      {/* Hero / Title */}
      <section className="px-6 md:px-16 py-12 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-4">
          Our Categories
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          Explore all the categories of our kids products.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="px-6 md:px-16 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={`/categories/products/${cat.slug}`}
              className={`rounded-2xl shadow-md p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg flex flex-col items-center cursor-pointer ${cat.color}`}
            >
              <div className="w-28 h-28 rounded-full flex items-center justify-center mb-4 bg-white shadow-inner">
                <img
                  src={cat.src}
                  alt={cat.title}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">{cat.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-6 text-center text-gray-500">
        © 2026 KidsShop. All rights reserved.
      </footer>
    </main>
  );
}
