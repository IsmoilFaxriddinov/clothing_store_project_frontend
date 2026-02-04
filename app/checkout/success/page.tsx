"use client";

import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function SuccessPage() {
  const { cart } = useCart();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6">
      
      {/* PTICHKA */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mb-6"
      >
        <svg
          className="w-16 h-16 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <h1 className="text-3xl font-bold text-zinc-800 mb-2">
        Payment Successful 🎉
      </h1>
      <p className="text-zinc-500 mb-10 text-center">
        Thank you for your purchase!
      </p>

      {/* PRODUCTS */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-zinc-800 mb-2">
          Purchased Products
        </h2>

        {cart.map((item, idx) => (
          <div
            key={idx}
            className="flex gap-4 border-b last:border-none pb-4"
          >
            <img
              src={item.image}
              className="w-20 h-20 object-contain"
              alt={item.title}
            />
            <div className="flex-1">
              <p className="font-semibold text-zinc-800">
                {item.title}
              </p>
              <p className="text-sm text-zinc-500">
                {item.color} • {item.size}
              </p>
            </div>
            <span className="font-semibold text-zinc-700">
              x{item.quantity}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/products"
        className="mt-10 bg-zinc-800 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-zinc-900 transition"
      >
        Back to Shop
      </Link>
    </div>
  );
}
