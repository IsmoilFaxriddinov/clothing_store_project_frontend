"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiFillHeart } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { useFavorite } from "../context/FavoriteContext";

type Product = {
  title?: string;
  quantity?: number;
  size?: string;
  color?: string;
  price?: number;
  category?: string;
  slug?: string;
  discount?: number;
  promo_code?: string;
  images?: string[];
};

type Order = {
  id: string;
  user: { name: string; phone: string; address: string };
  items?: any[];
  products?: Product[];
  Statuss?: "new" | "on_way" | "delivered";
  admin_message?: string;
  delivery_request_time?: string;
  delivery_end_time?: string;
};

export default function ProfilePage() {
  const { favorites, toggleFavorite } = useFavorite();
  const [order, setOrder] = useState<Order | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [editTime, setEditTime] = useState<boolean>(false);

  const getSafeString = (value: any) => value || "-";

  const getProductTitle = (p: Product) => p.title || "Noma'lum mahsulot";

  const getStatusUz = () => {
    if (!order) return "";
    if (order.Statuss === "delivered") return "Yetkazildi ✅";
    if (order.Statuss === "on_way") return "Yo‘lga chiqdi 🚚";
    if (!order.delivery_request_time) return "Vaqt tanlash kerak ⏳";
    return "Admin javobini kuting ⏳";
  };

  const fetchLastOrder = async () => {
    try {
      const res = await fetch("http://localhost:1337/api/orders/last");
      const data = await res.json();
      if (!data.order) return console.log("Hozircha buyurtma mavjud emas");

      const lastOrder = data.order;

      // ===== MAP ITEMS TO PRODUCTS =====
      lastOrder.products = (lastOrder.items || []).map((item: any) => ({
        title: item.title ?? "Noma'lum mahsulot",
        price: item.price ?? 0,
        quantity: item.quantity ?? 1,
        category: typeof item.category === "object" ? item.category?.name || "-" : item.category || "-",
        color: typeof item.color === "string" ? item.color : "-",
        size: typeof item.size === "string" ? item.size : "-",
        discount: item.discount ?? 0,
        promo_code: item.promo_code ?? "",
        images: item.images || [],
      }));

      // ===== TIMER =====
      if (lastOrder.Statuss === "on_way" && lastOrder.delivery_end_time) {
        const endTime = new Date(lastOrder.delivery_end_time).getTime();
        const remaining = Math.max(Math.floor((endTime - Date.now()) / 1000), 0);
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
      }

      setOrder(lastOrder);
      setSelectedTime("");
      setEditTime(false);
    } catch (err) {
      console.error("Buyurtma olishda xato:", err);
    }
  };

  useEffect(() => {
    fetchLastOrder();
    const interval = setInterval(fetchLastOrder, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!order || order.Statuss !== "on_way" || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [order, timeLeft]);

  const handleTimeSubmit = async () => {
    if (!selectedTime || !order?.id) return alert("Iltimos, vaqtni tanlang");

    try {
      const res = await fetch("http://localhost:1337/api/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          delivery_request_time: selectedTime,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Vaqt muvaffaqiyatli saqlandi!");
        setSelectedTime("");
        setEditTime(false);
        fetchLastOrder();
      } else {
        alert("Xatolik: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Serverda xatolik yuz berdi");
    }
  };

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getMinDateTimeLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  return (
    <main className="min-h-screen bg-white p-6 md:p-16">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900">Mening Profilim</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* ===== ORDER ===== */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Joriy Buyurtma</h2>
          {order ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* USER INFO */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg text-gray-900">{getSafeString(order.user.name)}</p>
                  <p className="text-sm text-gray-600">{getSafeString(order.user.phone)}</p>
                  <p className="text-sm text-gray-600">{getSafeString(order.user.address)}</p>
                </div>
                <span className="px-4 py-1 rounded-full bg-gray-900 text-white text-sm font-semibold">{getStatusUz()}</span>
              </div>

              {/* ADMIN MESSAGE */}
              {order.admin_message && (
                <p className="mt-2 p-3 bg-yellow-100 text-yellow-900 rounded-lg border border-yellow-200">
                  📢 Admin: {getSafeString(order.admin_message)}
                </p>
              )}

              {/* DELIVERY TIME PICKER OR EDIT */}
              {((!order.delivery_request_time || editTime) && order.Statuss !== "on_way") && (
                <div className="my-4 p-4 rounded-xl border border-gray-300 bg-gray-50">
                  <h4 className="text-gray-900 font-semibold mb-2">Yetkazib berish vaqtini tanlang</h4>
                  <input
                    type="datetime-local"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    min={getMinDateTimeLocal()}
                    className="w-full bg-white text-black border border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <button
                    onClick={handleTimeSubmit}
                    className="w-full cursor-pointer bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors mb-2"
                  >
                    Submit
                  </button>
                  {!editTime && order.delivery_request_time && (
                    <button
                      onClick={() => { setEditTime(true); setSelectedTime(order.delivery_request_time ?? ""); }}
                      className="w-full cursor-pointer bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      O'zgartirish
                    </button>
                  )}
                </div>
              )}

              {/* DISPLAY REQUESTED TIME (READ ONLY) */}
              {order.delivery_request_time && !editTime && order.Statuss !== "on_way" && (
                <div className="my-4 p-4 rounded-xl border border-gray-300 bg-gray-50">
                  <h4 className="text-gray-900 font-semibold mb-2">Tanlangan vaqt</h4>
                  <p className="text-gray-700 font-semibold">{new Date(order.delivery_request_time).toLocaleString()}</p>
                </div>
              )}

              {/* TIMER */}
              {order.Statuss === "on_way" && order.delivery_end_time && (
                <div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gray-900"
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - (timeLeft / ((new Date(order.delivery_end_time).getTime() - Date.now()) / 1000 + timeLeft) * 100)}%` }}
                      transition={{ ease: "linear", duration: 1 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-mono">{formatTime(timeLeft)}</p>
                </div>
              )}

              {/* ===== PRODUCTS ===== */}
              <div className="flex flex-wrap gap-6 justify-center items-start min-h-[200px]">
                {order.products && order.products.length > 0 ? (
                  order.products.map((product, idx) => (
                    <motion.div
                      key={idx}
                      className="w-60 flex flex-col items-start justify-start bg-gray-50 rounded-3xl border border-gray-200 p-5 shadow-md hover:shadow-xl transition-shadow duration-300"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-gray-900 font-bold text-xl mb-2 truncate">{getProductTitle(product)}</p>
                      {product.color && <p className="text-gray-700 text-sm mb-1">Color: {product.color}</p>}
                      {product.size && <p className="text-gray-700 text-sm mb-1">Size: {product.size}</p>}
                      {product.price !== undefined && <p className="text-gray-800 font-semibold mb-1">Price: ${product.price}</p>}
                      {product.quantity !== undefined && <p className="text-gray-600 text-sm">Quantity: {product.quantity}</p>}
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="w-full flex flex-col items-center justify-center p-8 bg-gray-100 rounded-3xl border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FaCheckCircle className="text-6xl text-green-500 mb-4" />
                    <p className="text-gray-900 font-semibold text-lg">Buyurtmangiz qabul qilindi ✅</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <p className="text-gray-500">Hozircha buyurtma mavjud emas</p>
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
                  <div className="h-49 w-full bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-2xl">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Rasm yo‘q</span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 rounded-b-2xl">
                    <p className="text-white font-semibold text-center truncate">{p.title}</p>
                    <p className="text-white font-bold text-center">${p.price ?? "N/A"}</p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(p); }}
                    className="absolute top-3 right-3 text-xl text-white z-10 hover:scale-125 transition-transform duration-200"
                  >
                    <AiFillHeart className={favorites.some(fav => fav.slug === p.slug) ? "text-red-500" : "text-white"} />
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

