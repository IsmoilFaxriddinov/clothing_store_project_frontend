"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();

  // Delivery info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");

  // Payment
  const [cardNumber, setCardNumber] = useState("");
  const [cardPIN, setCardPIN] = useState("");

  // Promo
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const [loading, setLoading] = useState(false);

  // Prices
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
      setPromoError("Invalid promo code");
    }
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      router.push("/checkout/success");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-zinc-50 p-6 md:p-16">
      <h1 className="text-4xl font-extrabold text-zinc-800 mb-12 text-center">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* CART */}
        <div>
          <h2 className="text-2xl font-semibold text-zinc-800 mb-6">
            Your Cart
          </h2>

          <div className="space-y-4">
            {cart.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 bg-white p-4 rounded-3xl shadow border border-zinc-100"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-contain"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {item.color} • {item.size}
                  </p>
                  <p className="font-bold text-zinc-800">
                    ${item.price}
                  </p>
                </div>

                <span className="font-semibold text-zinc-600">
                  x{item.quantity}
                </span>
              </motion.div>
            ))}
          </div>

          {/* PROMO */}
          <div className="mt-6 bg-white p-5 rounded-3xl shadow border border-zinc-100">
            <h3 className="font-semibold text-lg text-zinc-800 mb-3">
              Promo Code
            </h3>

            <div className="flex gap-3">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-4 py-3 border border-zinc-300 rounded-2xl
                text-zinc-800 placeholder:text-zinc-400
                focus:ring-2 focus:ring-zinc-400 outline-none"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="bg-zinc-800 text-white px-5 rounded-2xl
                font-semibold hover:bg-zinc-900 transition"
              >
                Apply
              </button>
            </div>

            {promoError && (
              <p className="text-red-500 text-sm mt-2">
                {promoError}
              </p>
            )}
          </div>

          {/* TOTAL */}
          <div className="mt-6 bg-white p-5 rounded-3xl shadow border border-zinc-100 space-y-2">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-xl">
              <span className="text-zinc-800">Total</span>
              <span className="text-pink-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handlePurchase}
          className="bg-white p-8 rounded-3xl shadow-2xl space-y-4 border border-zinc-100"
        >
          <h2 className="text-2xl font-semibold text-zinc-800">
            Delivery Info
          </h2>

          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-zinc-300 rounded-2xl
            text-zinc-800 placeholder:text-zinc-400
            focus:ring-2 focus:ring-zinc-400 outline-none"
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 border border-zinc-300 rounded-2xl
            text-zinc-800 placeholder:text-zinc-400
            focus:ring-2 focus:ring-zinc-400 outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            {[["City", city, setCity],
              ["District", district, setDistrict],
              ["Street", street, setStreet],
              ["House", house, setHouse]].map(
              ([ph, val, set]: any, i) => (
                <input
                  key={i}
                  placeholder={ph}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  required
                  className="px-4 py-3 border border-zinc-300 rounded-2xl
                  text-zinc-800 placeholder:text-zinc-400
                  focus:ring-2 focus:ring-zinc-400 outline-none"
                />
              )
            )}
          </div>

          <h2 className="text-2xl font-semibold text-zinc-800 pt-4">
            Payment
          </h2>

          <input
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
            }
            required
            className="w-full px-4 py-3 border border-zinc-300 rounded-2xl
            tracking-widest text-zinc-800 placeholder:text-zinc-400
            focus:ring-2 focus:ring-zinc-400 outline-none"
          />

          <input
            type="password"
            placeholder="PIN"
            value={cardPIN}
            onChange={(e) => setCardPIN(e.target.value)}
            required
            className="w-full px-4 py-3 border border-zinc-300 rounded-2xl
            text-zinc-800 placeholder:text-zinc-400
            focus:ring-2 focus:ring-zinc-400 outline-none"
          />

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className="w-full mt-4 bg-pink-600 text-white py-3
            rounded-2xl font-bold hover:bg-pink-700 transition"
          >
            {loading ? "Processing..." : "Confirm Purchase"}
          </motion.button>
        </form>
      </div>
    </main>
  );
}
