"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiFillHeart } from "react-icons/ai";
import { useFavorite } from "../context/FavoriteContext";

type Product = {
  title: string;
  quantity: number;
  size?: string;
  color?: string;
  price?: number;
  category?: string;
  slug?: string;
  images?: string[];
  discount?: string;
};

type OrderWithTimer = {
  id: string;
  fullName: string | null;
  address: string | null;
  phone: string | null;
  products: Product[];
  startTime: number;
  deliveryTime: number;
  distanceFactor: number;
  status: string;
};

export default function ProfilePage() {
  const { favorites, toggleFavorite } = useFavorite();

  const [localOrders, setLocalOrders] = useState<OrderWithTimer[]>([]);
  const [elapsedTime, setElapsedTime] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [rating, setRating] = useState<Record<string, number>>({});
  const [comment, setComment] = useState<Record<string, string>>({});

  // LocalStorage dan orderlarni o‘qish
  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) {
      const orders: OrderWithTimer[] = JSON.parse(stored).map((o: OrderWithTimer) => ({
        ...o,
        status: "Zakaz qabul qilindi",
        deliveryTime: 0,
      }));
      setLocalOrders(orders);
    }
  }, []);

  // Timer va status update
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalOrders((prev) =>
        prev.map((order) => {
          const baseTime = 30; // minimal delivery 30s
          const deliveryTime = baseTime * (order.distanceFactor || 1);
          const elapsed = Math.min((Date.now() - order.startTime) / 1000, deliveryTime);

          let status = "Zakaz qabul qilindi";
          if (elapsed >= deliveryTime) status = "Yetib bordi va bajarildi";
          else if (elapsed >= deliveryTime / 2) status = "Yo‘lga chiqdi";

          setElapsedTime((t) => ({ ...t, [order.id]: elapsed }));

          if (elapsed >= deliveryTime && !showFeedback[order.id]) {
            setShowFeedback((prev) => ({ ...prev, [order.id]: true }));
          }

          return { ...order, status, deliveryTime };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [showFeedback]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmitFeedback = (orderId: string) => {
    console.log("Rating:", rating[orderId], "Comment:", comment[orderId]);
    alert("Rahmat! Sizning fikringiz qabul qilindi.");
    setShowFeedback((prev) => ({ ...prev, [orderId]: false }));
  };

  return (
    <main className="min-h-screen bg-zinc-50 p-6 md:p-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12 text-center">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* User Info + Orders */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Orders</h2>

          {localOrders.length === 0 ? (
            <p className="text-gray-500">You have no orders yet.</p>
          ) : (
            localOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-zinc-50 p-4 rounded-2xl shadow-md flex flex-col gap-4 border-l-4 border-green-400"
              >
                <p className="font-semibold text-gray-900 mb-2">{order.fullName}</p>
                <p className="text-gray-700 text-sm">{order.phone}</p>
                <p className="text-gray-700 text-sm">{order.address}</p>

                {/* Products */}
                <div className="flex flex-wrap gap-4">
                  {order.products.length > 0 ? (
                    order.products.map((p, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        className="w-48 bg-white p-3 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                      >
                        {p.images && p.images[0] && (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                        )}
                        <p className="font-semibold text-gray-900">{p.title}</p>
                        <p className="text-gray-700 text-sm">
                          Color: {p.color ?? "N/A"} | Size: {p.size ?? "N/A"}
                        </p>
                        <p className="text-gray-700 text-sm">Quantity: {p.quantity}</p>
                        <p className="text-gray-900 font-bold">${p.price ?? "N/A"}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500">No products in this order.</p>
                  )}
                </div>

                {/* Timer & Status */}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-600 text-sm font-mono">
                    Time: {formatTime(elapsedTime[order.id] ?? 0)} /{" "}
                    {formatTime(order.deliveryTime)}
                  </p>
                  <p
                    className={`font-bold px-3 py-1 rounded-xl ${
                      order.status === "Zakaz qabul qilindi"
                        ? "bg-yellow-300 text-yellow-900"
                        : order.status === "Yo‘lga chiqdi"
                        ? "bg-blue-300 text-blue-900"
                        : "bg-green-300 text-green-900"
                    }`}
                  >
                    {order.status}
                  </p>
                </div>

                {/* Feedback form */}
                {showFeedback[order.id] && (
                  <div className="mt-4 p-4 bg-white rounded-xl shadow flex flex-col gap-4">
                    <p className="font-semibold text-gray-900">
                      Iltimos, xizmatimizni baholang:
                    </p>
                    <div className="flex gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-3xl cursor-pointer ${
                            star <= (rating[order.id] || 0)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                          onClick={() =>
                            setRating((prev) => ({ ...prev, [order.id]: star }))
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <textarea
                      value={comment[order.id] || ""}
                      onChange={(e) =>
                        setComment((prev) => ({ ...prev, [order.id]: e.target.value }))
                      }
                      placeholder="Fikringizni yozing..."
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                      onClick={() => handleSubmitFeedback(order.id)}
                      className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Favorites */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Favorite Products</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-500">You have no favorite products yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-6">
              {favorites.map((product) => (
                <motion.div
                  key={product.slug}
                  whileHover={{ scale: 1.05 }}
                  className="bg-zinc-50 p-4 rounded-3xl shadow flex flex-col items-center gap-3 relative cursor-pointer"
                  onClick={() =>
                    window.location.href = `/categories/products/${product.category}/${product.slug}`
                  }
                >
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-40 w-full object-contain mb-2"
                    />
                  )}
                  <h3 className="font-semibold text-center">{product.title}</h3>
                  <span className="text-gray-900 font-bold">
                    {product.discount ?? product.price}
                  </span>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
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
      </div>
    </main>
  );
}
