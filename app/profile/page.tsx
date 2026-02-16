"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiFillHeart } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
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
};

type Order = {
  id: string;
  user: { name: string | object; phone: string | object; address: string | object };
  items?: Product[];
  products?: Product[];
  startTime?: number;
  distanceFactor?: number;
  discount?: number;
  promo_code?: string;
  Statuss?: "new" | "on_way" | "delivered";
  admin_message?: string;
};

export default function ProfilePage() {
  const { favorites, toggleFavorite } = useFavorite();
  const [order, setOrder] = useState<Order | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const fetchLastOrder = async () => {
    try {
      const res = await fetch("http://localhost:1337/api/orders/last");
      const data = await res.json();
      if (data.order) {
        const lastOrder = data.order;
        lastOrder.products = lastOrder.items || [];
        lastOrder.Statuss = lastOrder.Statuss || lastOrder.status || "new";
        lastOrder.startTime = lastOrder.startTime || Date.now();
        setOrder(lastOrder);
      }
    } catch (err) {
      console.error("Buyurtma olishda xato:", err);
    }
  };

  useEffect(() => {
    fetchLastOrder();
    const interval = setInterval(fetchLastOrder, 30000);
    return () => clearInterval(interval);
  }, []);

  // Timer faqat "on_way" bo'lganda ishlaydi
  useEffect(() => {
    if (!order || order.Statuss !== "on_way") {
      setTimerActive(false);
      setElapsed(0);
      return;
    }
    setTimerActive(true);

    const interval = setInterval(() => {
      setElapsed(prev => prev + 1); // Sekundlar oshadi
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getSafeString = (value: string | object | undefined) => {
    if (!value) return "-";
    return typeof value === "string" ? value : JSON.stringify(value);
  };

  const getStatusUz = () => {
    if (!order) return "";
    if (order.Statuss === "delivered") return "Yetkazildi ✅";
    if (order.Statuss === "on_way") return "Yo‘lga chiqdi 🚚";
    if (order.Statuss === "new") return "Admin javobini kuting ⏳";
    return "";
  };

  return (
    <main className="min-h-screen bg-white p-6 md:p-16">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900">Mening Profilim</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* ===== ORDER ===== */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Joriy Buyurtma</h2>

          {!order ? (
            <p className="text-gray-500">Hozirda buyurtma yo‘q</p>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* BUYURTMA INFO */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg text-gray-900">{getSafeString(order.user?.name)}</p>
                  <p className="text-sm text-gray-600">{getSafeString(order.user?.phone)}</p>
                  <p className="text-sm text-gray-600">{getSafeString(order.user?.address)}</p>
                </div>
                <span className="px-4 py-1 rounded-full bg-gray-900 text-white text-sm font-semibold">{getStatusUz()}</span>
              </div>

              {order.admin_message && (
                <p className="mt-2 p-3 bg-yellow-100 text-yellow-900 rounded-lg border border-yellow-200">
                  📢 Admin: {getSafeString(order.admin_message)}
                </p>
              )}

              {/* TIMER */}
              {timerActive && (
                <div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gray-900"
                      initial={{ width: 0 }}
                      animate={{ width: `${elapsed * 2}%` }}
                      transition={{ ease: "linear", duration: 1 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-mono">{formatTime(elapsed)}</p>
                </div>
              )}

              {/* PRODUCTS PTICHKA */}
              <div className="flex flex-wrap gap-4 justify-center items-center min-h-[200px]">
                {(order.products || []).length > 0 ? (
                  <motion.div
                    className="w-full flex flex-col items-center justify-center bg-gray-100 rounded-2xl border border-gray-200 p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FaCheckCircle className="text-8xl text-gray-400 mb-4 animate-bounce" />
                    <p className="text-gray-500 font-semibold text-lg">Mahsulotlar hozir ko‘rinmayapti</p>
                  </motion.div>
                ) : (
                  <motion.div className="w-full flex flex-col items-center justify-center p-8 bg-gray-100 rounded-2xl border border-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <FaCheckCircle className="text-6xl text-green-500 mb-4" />
                    <p className="text-gray-800 font-semibold text-lg">Buyurtmangiz qabul qilindi ✅</p>
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
                  onClick={() => window.location.href = `/categories/products/${p.category}/${p.slug}`}
                  className="relative border border-gray-200 rounded-2xl shadow-sm overflow-hidden cursor-pointer group"
                >
                  {p.images?.[0] && (
                    <img src={p.images[0]} className="h-36 w-full object-contain transition-transform duration-300 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 rounded-b-2xl">
                    <p className="text-white font-semibold text-center">{getSafeString(p.title)}</p>
                    <p className="text-white font-bold text-center">${p.price || "N/A"}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p);
                    }}
                    className="absolute top-3 right-3 text-xl text-white z-10"
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

