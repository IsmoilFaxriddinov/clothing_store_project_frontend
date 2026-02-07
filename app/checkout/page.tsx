"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import CheckoutMap from "@/components/CheckoutMap";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, updateColor, updateSize, removeFromCart } =
    useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("Toshkent");
  const [editingAddress, setEditingAddress] = useState(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    { lat: 41.30557, lng: 69.23136 }
  );

  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal - discount;

  const applyPromo = () => {
    if (promo.toUpperCase() === "SALE10") {
      setDiscount(subtotal * 0.1);
      setPromoError("");
    } else {
      setDiscount(0);
      setPromoError("Promo kodi noto‘g‘ri");
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!latLng) {
      alert("Iltimos, xaritada manzilingizni tanlang!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Strapi backend endpointiga fetch
      const res = await fetch("http://localhost:1338/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            user: {
              name: fullName,
              phone,
              address,
            },
            items: cart.map((item) => ({
              product: item.title,
              color: item.color,
              size: item.size,
              price: item.price,
              quantity: item.quantity,
            })),
            discount,
            promo_code: promo || null,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          "Xato yuz berdi: " + (data.error?.message || "Server xatosi")
        );
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/checkout/success");
    } catch (err: any) {
      alert("Xato yuz berdi: " + err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-6 md:p-16 text-gray-900">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-pink-500">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Cart */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Savatcha</h2>
          <div className="space-y-4">
            {cart.map((item) => (
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
                    <select
                      value={item.color}
                      onChange={(e) => updateColor(item.id, e.target.value)}
                      className="bg-gray-200 rounded-xl px-2 py-1 text-sm"
                    >
                      <option>Red</option>
                      <option>Blue</option>
                      <option>Black</option>
                    </select>
                    <select
                      value={item.size}
                      onChange={(e) => updateSize(item.id, e.target.value)}
                      className="bg-gray-200 rounded-xl px-2 py-1 text-sm"
                    >
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                    </select>
                  </div>
                  <p className="font-bold">${item.price}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.id,
                        Math.min(Number(e.target.value), 20)
                      )
                    }
                    className="w-16 text-center rounded-xl bg-gray-200 border"
                  />
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    O‘chirish
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 bg-gray-100 p-5 rounded-2xl shadow space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Jami</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Chegirma</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl text-gray-900">
              <span>Umumiy</span>
              <span className="text-pink-500">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handlePurchase}
          className="bg-gray-100 p-8 rounded-2xl shadow space-y-4"
        >
          <h2 className="text-2xl font-semibold text-pink-500">
            Yetkazib berish
          </h2>

          <input
            placeholder="To‘liq ism"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl bg-white border focus:ring-2 focus:ring-pink-500 outline-none"
          />

          <input
            placeholder="Telefon raqam"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl bg-white border focus:ring-2 focus:ring-pink-500 outline-none"
          />

          {/* Map */}
          <CheckoutMap
            latLng={latLng}
            setLatLng={setLatLng}
            setAddress={setAddress}
          />

          {/* Address tahrirlash */}
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
                {editingAddress ? "Saqlash" : "Tahrirlash"}
              </button>
            </div>
          )}

          {/* Promo */}
          <div className="pt-4 flex gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo kodi"
              className="flex-1 px-4 py-3 rounded-2xl bg-white border focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="px-5 rounded-2xl bg-pink-500 font-semibold hover:bg-pink-600 transition"
            >
              Qo‘llash
            </button>
          </div>
          {promoError && <p className="text-red-500 mt-1">{promoError}</p>}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className="w-full mt-4 bg-pink-500 text-white py-3 rounded-2xl font-bold hover:bg-pink-600 transition"
          >
            {loading ? "Jarayonda..." : "Sotib olish"}
          </motion.button>
        </form>
      </div>
    </main>
  );
}
