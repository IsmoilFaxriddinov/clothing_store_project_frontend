"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const categories = [
    { title: "Pants", src: "/category-pants.png", color: "bg-yellow-100", slug: "pants" },
    { title: "Shoes", src: "/category-shoes.png", color: "bg-green-100", slug: "shoes" },
    { title: "Jackets", src: "/category-jackets.png", color: "bg-blue-100", slug: "jackets" },
    { title: "Accessories", src: "/category-accessories.png", color: "bg-pink-100", slug: "accessories" },
  ];

  return (
    <main className="bg-gradient-to-b from-pink-50 to-blue-50 min-h-screen text-gray-900 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 md:py-20 mb-16 relative">
        {/* Text */}
        <div className="md:w-1/2 flex flex-col z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-pink-700">
            Welcome to KidsShop!
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-700">
            Your favorite place for kids clothing, shoes, and accessories.
          </p>
          <button
            onClick={() => router.push("/categories/products/pants")}
            className="bg-pink-300 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Shop Now
          </button>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center relative">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-yellow-100 rounded-full flex items-center justify-center shadow-xl">
            <img
              src="/hero-kids.png"
              alt="Kids Shopping"
              className="w-48 h-48 md:w-56 md:h-56 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-6 md:px-16 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-pink-700">
          Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => router.push(`/categories/products/${cat.slug}`)}
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
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
    </main>
  );
}
