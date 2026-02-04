"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFavorite } from "../context/FavoriteContext";
import { AiFillHeart } from "react-icons/ai";

// Test uchun foydalanuvchi va orderlar
const mockUser = {
  fullName: "Ismoil Faxriddinov",
  email: "ismoil@example.com",
  phone: "+998901234567",
  password: "********",
  orders: [
    { id: 1, product: "Red Shoes", price: 30, date: "2026-01-30" },
    { id: 2, product: "Blue Jacket", price: 50, date: "2026-01-28" },
    { id: 3, product: "Green Pants", price: 25, date: "2026-01-25" },
  ],
};

export default function ProfilePage() {
  const [user] = useState(mockUser);
  const { favorites, toggleFavorite } = useFavorite();

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-6 md:p-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-12 text-center">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* USER INFO */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Account Info
          </h2>

          <div className="flex flex-col gap-4">
            {[
              { label: "Full Name", value: user.fullName },
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone },
              { label: "Password", value: user.password },
            ].map((info) => (
              <div key={info.label} className="flex flex-col">
                <p className="text-gray-500 font-semibold">{info.label}</p>
                <p className="text-gray-900 font-medium">{info.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ORDERS */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h2>

          {user.orders.length === 0 ? (
            <p className="text-gray-500">You have no orders yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {user.orders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl shadow-inner hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{order.product}</p>
                    <p className="text-gray-500 text-sm">Date: {order.date}</p>
                  </div>
                  <p className="text-pink-700 font-bold">${order.price}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* FAVORITES */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-pink-700 mb-6">My Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-500">You have no favorite products yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <motion.div
                key={product.slug}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-3xl shadow flex flex-col items-center gap-3 relative"
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-40 w-full object-contain mb-2"
                />
                <h3 className="font-semibold text-center">{product.title}</h3>
                <span className="text-pink-700 font-bold">
                  {product.discount ?? product.price}
                </span>
                {/* Yurakni bosib o'chirish */}
                <motion.button
                  onClick={() => toggleFavorite(product)}
                  whileTap={{ scale: 0.8 }}
                  className="absolute top-3 right-3 text-2xl"
                >
                  <AiFillHeart className="text-red-500" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
