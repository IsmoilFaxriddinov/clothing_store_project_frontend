"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import CheckoutMap from "@/components/CheckoutMap";
import { useLang } from "../context/LangContext"; // global lang
import { getDictionary } from "../lib/i18n"; // dictionary

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
  availableColors?: string[];
  availableSizes?: string[];
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, updateColor, updateSize, removeFromCart } = useCart();
  const { lang } = useLang(); // global lang
  const t = getDictionary(lang); // dictionary

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("Toshkent");
  const [editingAddress, setEditingAddress] = useState(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>({
    lat: 41.30557,
    lng: 69.23136,
  });

  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal - discount;

  // -------------------- PROMO CODE --------------------
  const applyPromo = async () => {
    if (!promo) return;

    try {
      const res = await fetch("http://localhost:1337/api/promo-code/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { code: promo } }),
      });

      const data = await res.json();

      if (res.ok) {
        const calculatedDiscount = (subtotal * data.discount) / 100;
        setDiscount(calculatedDiscount);
        setPromoError("");
      } else {
        setDiscount(0);
        setPromoError(data.message || t.promo_invalid);
      }
    } catch (err) {
      console.error(err);
      setDiscount(0);
      setPromoError(t.server_error);
    }
  };

  // -------------------- PURCHASE --------------------
  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latLng) return alert(t.select_address);
    if (cart.length === 0) return alert(t.empty_cart);

    setLoading(true);

    const orderForFrontend = {
      user: {
        name: fullName,
        phone,
        address,
        location: { latitude: latLng.lat, longitude: latLng.lng },
      },
      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        color: item.color || "",
        size: item.size || "",
      })),
      discount,
      promo_code: promo || undefined,
      Statuss: "new",
      startTime: Date.now(),
      distanceFactor: 1,
      createdAt: new Date().toISOString(),
    };

    try {
      // LocalStorage uchun
      const existing = localStorage.getItem("orders");
      const orders = existing ? JSON.parse(existing) : [];
      localStorage.setItem("orders", JSON.stringify([...orders, orderForFrontend]));

      // Strapi API-ga jo'natish
      await fetch("http://localhost:1337/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: orderForFrontend }),
      });

      setLoading(false);
      router.push("/profile");
    } catch (err: any) {
      alert(t.error_occurred + ": " + err.message);
      setLoading(false);
    }
  };

  // -------------------- PHONE FORMAT --------------------
  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("998")) digits = digits.slice(3);
    return "+(998)" + digits.slice(0, 9);
  };

  // -------------------- RENDER --------------------
  return (
  <main className="min-h-screen bg-white p-6 md:p-16 text-gray-900">
    <h1 className="text-4xl font-extrabold mb-12 text-center text-pink-500">
      {t.checkout}
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* CART */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">{t.cart}</h2>
        <div className="space-y-4">
          {cart.map((item: CartItem) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 bg-gray-100 p-4 rounded-2xl shadow"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-contain rounded-lg"
              />
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold">{item.title}</h3>
                <div className="flex gap-2 items-center">
                  {(item.availableColors || []).length > 0 && (
                    <select
                      value={item.color || ""}
                      onChange={(e) => updateColor(item.id, e.target.value)}
                      className="bg-gray-200 rounded-xl px-2 py-1 text-sm"
                    >
                      <option value="">{t.select_color}</option>
                      {(item.availableColors || []).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                  {(item.availableSizes || []).length > 0 && (
                    <select
                      value={item.size || ""}
                      onChange={(e) => updateSize(item.id, e.target.value)}
                      className="bg-gray-200 rounded-xl px-2 py-1 text-sm"
                    >
                      <option value="">{t.select_size}</option>
                      {(item.availableSizes || []).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </div>
                <p className="font-bold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Math.min(Number(e.target.value), 20))
                  }
                  className="w-16 text-center rounded-xl bg-gray-200 border"
                />
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  {t.remove}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-6 bg-gray-100 p-5 rounded-2xl shadow space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>{t.total}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{t.discount}</span>
              <span>- ${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-xl text-gray-900">
            <span>{t.grand_total}</span>
            <span className="text-pink-500">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handlePurchase}
        className="bg-gray-100 p-8 rounded-2xl shadow space-y-4"
      >
        <h2 className="text-2xl font-semibold text-pink-500">{t.delivery}</h2>
        <input
          placeholder={t.full_name}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-2xl bg-white border focus:ring-2 focus:ring-pink-500 outline-none"
        />
        <input
          type="tel"
          placeholder={t.phone_placeholder}
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          required
          className="w-full px-4 py-3 rounded-2xl bg-white border focus:ring-2 focus:ring-pink-500 outline-none"
        />
        <CheckoutMap latLng={latLng} setLatLng={setLatLng} setAddress={setAddress} />
        {address && (
          <div className="flex items-center gap-2 mt-2">
            {editingAddress ? (
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-xl"
              />
            ) : (
              <p className="flex-1 text-gray-700">{address}</p>
            )}
            <button
              type="button"
              onClick={() => setEditingAddress(!editingAddress)}
              className="px-3 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
            >
              {editingAddress ? t.save : t.edit}
            </button>
          </div>
        )}

        {/* PROMO */}
        <div className="pt-4 flex gap-2">
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder={t.promo_placeholder}
            className="flex-1 px-4 py-3 rounded-2xl bg-white border focus:ring-2 focus:ring-pink-500 outline-none"
          />
          <button
            type="button"
            onClick={applyPromo}
            className="px-5 rounded-2xl bg-pink-500 font-semibold hover:bg-pink-600 transition"
          >
            {t.apply_promo}
          </button>
        </div>
        {promoError && <p className="text-red-500 mt-1">{promoError}</p>}

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          disabled={loading}
          className="w-full mt-4 bg-pink-500 text-white py-3 rounded-2xl font-bold hover:bg-pink-600 transition"
        >
          {loading ? t.processing : t.purchase}
        </motion.button>
      </form>
    </div>
  </main>
);
}