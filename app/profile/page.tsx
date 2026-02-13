"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiFillHeart } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa"; // ✅ icon
import { useFavorite } from "../context/FavoriteContext";

/* ===== TYPES ===== */
type Product = {
  title: string;
  quantity: number;
  size?: string;
  color?: string;
  price?: number;
  category?: string;
  slug?: string;
  images?: string[];
};

type Order = {
  id: string;
  user: { name: string; phone: string; address: string };
  products: Product[];
  startTime: number;
  distanceFactor?: number;
  discount?: number;
  promo_code?: string;
};

/* ===== PAGE ===== */
export default function ProfilePage() {
  const { favorites, toggleFavorite } = useFavorite();

  const [order, setOrder] = useState<Order | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [notified, setNotified] = useState(false);

  /* ===== LOAD LAST ORDER ===== */
  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) {
      const orders = JSON.parse(stored);
      if (orders.length > 0) {
        const lastOrder = orders[orders.length - 1];

        lastOrder.startTime = lastOrder.startTime || Date.now();
        lastOrder.distanceFactor = lastOrder.distanceFactor || 1;
        lastOrder.products = Array.isArray(lastOrder.products)
          ? lastOrder.products
          : [];

        setOrder(lastOrder);
      }
    }
  }, []);

  /* ===== TIMER ===== */
  useEffect(() => {
    if (!order) return;

    const deliveryTime = Math.floor(30 * (order.distanceFactor || 1));

    const interval = setInterval(() => {
      const now = Date.now();
      let passed = Math.floor((now - order.startTime) / 1000);
      if (passed > deliveryTime) passed = deliveryTime;
      setElapsed(passed);
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  /* ===== TELEGRAM NOTIFY ===== */
  useEffect(() => {
    if (!order || notified) return;

    const deliveryTime = Math.floor(30 * (order.distanceFactor || 1));

    if (elapsed >= deliveryTime && order.id) {
      fetch("http://localhost:1337/api/orders/notify-delivered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      })
        .then(() => setNotified(true))
        .catch((err) => console.error("Telegram yuborilmadi", err));
    }
  }, [elapsed, order, notified]);

  const deliveryTime = order ? Math.floor(30 * (order.distanceFactor || 1)) : 0;
  const progress = deliveryTime ? Math.min((elapsed / deliveryTime) * 100, 100) : 0;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getStatusUz = () => {
    if (!order) return "";
    if (elapsed >= deliveryTime) return "Yetkazildi ✅";
    if (elapsed >= deliveryTime / 2) return "Yo‘lga chiqdi 🚚";
    return "Qabul qilindi 📝";
  };

  return (
    <main className="min-h-screen bg-white p-6 md:p-16">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
        Mening Profilim
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* ===== ORDER ===== */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Joriy Buyurtma</h2>

          {!order ? (
            <p className="text-gray-500">Hozirda buyurtma yo‘q</p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* INFO */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg text-gray-900">{order.user.name}</p>
                  <p className="text-sm text-gray-600">{order.user.phone}</p>
                  <p className="text-sm text-gray-600">{order.user.address}</p>
                </div>
                <span className="px-4 py-1 rounded-full bg-gray-900 text-white text-sm font-semibold">
                  {getStatusUz()}
                </span>
              </div>

              {/* PROGRESS BAR */}
              <div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 font-mono">
                  {formatTime(elapsed)} / {formatTime(deliveryTime)}
                </p>
              </div>

              {/* PRODUCTS OR CONFIRMATION */}
              <div className="flex flex-wrap gap-4">
                {order.products.length > 0 ? (
                  order.products.map((p, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03 }}
                      className="w-48 border border-gray-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition"
                    >
                      {p.images?.[0] && (
                        <img
                          src={p.images[0]}
                          className="w-full h-32 object-cover rounded-xl mb-2"
                        />
                      )}
                      <p className="font-semibold text-gray-900">{p.title}</p>
                      <p className="text-sm text-gray-600">
                        {p.color || "-"} · {p.size || "-"}
                      </p>
                      <p className="text-sm text-gray-600">Soni: {p.quantity}</p>
                      <p className="font-bold text-gray-900">${p.price || "N/A"}</p>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="w-full flex flex-col items-center justify-center p-8 bg-gray-100 rounded-2xl border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FaCheckCircle className="text-6xl text-green-500 mb-4" />
                    <p className="text-gray-800 font-semibold text-lg">
                      Sizning buyurtmangiz qabul qilindi ✅
                    </p>
                    <p className="text-gray-500 mt-2 text-center">
                      Mahsulotlar hozircha ko‘rsatilmayapti
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* ===== FAVORITES ===== */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Sevimli Mahsulotlar</h2>

          {favorites.length === 0 ? (
            <p className="text-gray-500">Sevimli mahsulot yo‘q</p>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {favorites.map((p) => (
                <motion.div
                  key={p.slug}
                  whileHover={{ scale: 1.05 }}
                  onClick={() =>
                    (window.location.href = `/categories/products/${p.category}/${p.slug}`)
                  }
                  className="relative border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer transition"
                >
                  {p.images?.[0] && (
                    <img
                      src={p.images[0]}
                      className="h-36 w-full object-contain mb-2"
                    />
                  )}
                  <p className="font-semibold text-center text-gray-900">{p.title}</p>
                  <p className="text-center font-bold text-gray-900">
                    ${p.price || "N/A"}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p);
                    }}
                    className="absolute top-3 right-3 text-xl text-gray-900"
                  >
                    <AiFillHeart />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
