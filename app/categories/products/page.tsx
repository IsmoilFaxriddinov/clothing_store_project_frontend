import React from "react";

const products = [
  { slug: "red-pants", title: "Red Pants", price: "$20", src: "/product-pants.png" },
  { slug: "blue-shoes", title: "Blue Shoes", price: "$35", src: "/product-shoes.png" },
  { slug: "green-jacket", title: "Green Jacket", price: "$50", src: "/product-jacket.png" },
  { slug: "yellow-hat", title: "Yellow Hat", price: "$15", src: "/product-hat.png" },
  { slug: "orange-shirt", title: "Orange Shirt", price: "$18", src: "/product-shirt.png" },
  { slug: "purple-sneakers", title: "Purple Sneakers", price: "$40", src: "/product-sneakers.png" },
  { slug: "blue-dress", title: "Blue Dress", price: "$45", src: "/product-dress.png" },
  { slug: "cyan-shorts", title: "Cyan Shorts", price: "$22", src: "/product-shorts.png" },
];

export default function ProductsPage() {
  return (
    <main className="bg-gradient-to-b from-pink-50 to-blue-50 min-h-screen text-gray-900 px-6 md:px-16 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-pink-700">
        All Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <a
            key={product.slug}
            href={`/products/${product.slug}`}
            className="bg-white rounded-2xl shadow-md p-6 text-center transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="w-32 h-32 mx-auto mb-4">
              <img
                src={product.src}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
            <p className="text-pink-700 font-bold">{product.price}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
