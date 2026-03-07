"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiFillHeart } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { useFavorite } from "../context/FavoriteContext";
import { useLang } from "../context/LangContext";
import { getDictionary } from "../lib/i18n";

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

  const { lang } = useLang();
  const t = getDictionary(lang);

  const [order, setOrder] = useState<Order | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [editTime, setEditTime] = useState<boolean>(false);

  const getSafeString = (value: any) => value || "-";

  const getProductTitle = (p: Product) => p.title || t.unknown_product;

  const getStatusText = () => {
    if (!order) return "";
    if (order.Statuss === "delivered") return t.status_delivered;
    if (order.Statuss === "on_way") return t.status_on_way;
    if (!order.delivery_request_time) return t.status_select_time;
    return t.status_wait_admin;
  };

  const fetchLastOrder = async () => {
    try {
      const res = await fetch("http://localhost:1337/api/orders/last");
      const data = await res.json();
      if (!data.order) return console.log(t.no_orders);

      const lastOrder = data.order;

      lastOrder.products = (lastOrder.items || []).map((item: any) => ({
        title: item.title ?? t.unknown_product,
        price: item.price ?? 0,
        quantity: item.quantity ?? 1,
        category:
          typeof item.category === "object"
            ? item.category?.name || "-"
            : item.category || "-",
        color: typeof item.color === "string" ? item.color : "-",
        size: typeof item.size === "string" ? item.size : "-",
        discount: item.discount ?? 0,
        promo_code: item.promo_code ?? "",
        images: item.images || [],
      }));

      if (lastOrder.Statuss === "on_way" && lastOrder.delivery_end_time) {
        const endTime = new Date(lastOrder.delivery_end_time).getTime();
        const remaining = Math.max(
          Math.floor((endTime - Date.now()) / 1000),
          0
        );
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
      }

      setOrder(lastOrder);
      setSelectedTime("");
      setEditTime(false);
    } catch (err) {
      console.error(t.order_fetch_error, err);
    }
  };

  useEffect(() => {
    fetchLastOrder();
    const interval = setInterval(fetchLastOrder, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!order || order.Statuss !== "on_way" || timeLeft <= 0) return;
    const timer = setInterval(
      () => setTimeLeft((prev) => Math.max(prev - 1, 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [order, timeLeft]);

  const handleTimeSubmit = async () => {
    if (!selectedTime || !order?.id) return alert(t.select_time_alert);

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
        alert(t.time_saved);
        setSelectedTime("");
        setEditTime(false);
        fetchLastOrder();
      } else {
        alert(t.error + ": " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert(t.server_error);
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
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
        {t.my_profile}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {t.current_order}
          </h2>

          {order ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg text-gray-900">
                    {getSafeString(order.user.name)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getSafeString(order.user.phone)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getSafeString(order.user.address)}
                  </p>
                </div>

                <span className="px-4 py-1 rounded-full bg-gray-900 text-white text-sm font-semibold">
                  {getStatusText()}
                </span>
              </div>

              {order.admin_message && (
                <p className="mt-2 p-3 bg-yellow-100 text-yellow-900 rounded-lg border border-yellow-200">
                  📢 Admin: {getSafeString(order.admin_message)}
                </p>
              )}

              {((!order.delivery_request_time || editTime) &&
                order.Statuss !== "on_way") && (
                <div className="my-4 p-4 rounded-xl border border-gray-300 bg-gray-50">
                  <h4 className="text-gray-900 font-semibold mb-2">
                    {t.select_delivery_time}
                  </h4>

                  <input
                    type="datetime-local"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    min={getMinDateTimeLocal()}
                    className="w-full bg-white text-black border border-gray-300 p-2 rounded-lg mb-4"
                  />

                  <button
                    onClick={handleTimeSubmit}
                    className="w-full bg-gray-900 text-white py-2 rounded-lg mb-2"
                  >
                    {t.submit}
                  </button>

                  {!editTime && order.delivery_request_time && (
                    <button
                      onClick={() => {
                        setEditTime(true);
                        setSelectedTime(order.delivery_request_time ?? "");
                      }}
                      className="w-full bg-gray-600 text-white py-2 rounded-lg"
                    >
                      {t.edit}
                    </button>
                  )}
                </div>
              )}

              {order.delivery_request_time &&
                !editTime &&
                order.Statuss !== "on_way" && (
                  <div className="my-4 p-4 rounded-xl border border-gray-300 bg-gray-50">
                    <h4 className="text-gray-900 font-semibold mb-2">
                      {t.selected_time}
                    </h4>

                    <p className="text-gray-700 font-semibold">
                      {new Date(
                        order.delivery_request_time
                      ).toLocaleString()}
                    </p>
                  </div>
                )}

              {order.Statuss === "on_way" && order.delivery_end_time && (
                <div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gray-900"
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - timeLeft}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-mono">
                    {formatTime(timeLeft)}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-6 justify-center items-start min-h-[200px]">
                {order.products && order.products.length > 0 ? (
                  order.products.map((product, idx) => (
                    <motion.div
                      key={idx}
                      className="w-60 bg-gray-50 rounded-3xl border p-5 shadow-md"
                    >
                      <p className="font-bold text-xl mb-2 truncate">
                        {getProductTitle(product)}
                      </p>

                      {product.color && (
                        <p className="text-sm">
                          {t.color}: {product.color}
                        </p>
                      )}

                      {product.size && (
                        <p className="text-sm">
                          {t.size}: {product.size}
                        </p>
                      )}

                      {product.price !== undefined && (
                        <p className="font-semibold">
                          {t.price}: ${product.price}
                        </p>
                      )}

                      {product.quantity !== undefined && (
                        <p className="text-sm">
                          {t.quantity}: {product.quantity}
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <motion.div className="w-full flex flex-col items-center justify-center p-8 bg-gray-100 rounded-3xl border">
                    <FaCheckCircle className="text-6xl text-green-500 mb-4" />
                    <p className="font-semibold text-lg">
                      {t.order_received}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <p className="text-gray-500">{t.no_orders}</p>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {t.favorite_products}
          </h2>

          {favorites.length === 0 ? (
            <p className="text-gray-500">{t.no_favorites}</p>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {favorites.map((p) => (
                <motion.div
                  key={p.slug}
                  whileHover={{ scale: 1.05 }}
                  onClick={() =>
                    (window.location.href = `/categories/products/${p.category}/${p.slug}`)
                  }
                  className="relative border rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <div className="h-49 w-full bg-gray-200 flex items-center justify-center">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        {t.no_image}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p);
                    }}
                    className="absolute top-3 right-3 text-xl text-white"
                  >
                    <AiFillHeart
                      className={
                        favorites.some((fav) => fav.slug === p.slug)
                          ? "text-red-500"
                          : "text-white"
                      }
                    />
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