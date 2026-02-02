"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Test uchun cartdagi mahsulot
const initialCart = [
  {
    title: "Red Shoes",
    price: 30,
    color: "Red",
    size: "29",
    quantity: 1,
    image: "/product-shoes.png",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart] = useState(initialCart);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardPIN, setCardPIN] = useState("");
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Test alert
    setTimeout(() => {
      alert(
        `Thank you, ${fullName}!\nYour order of $${totalPrice} is confirmed.\nDelivery: ${city}, ${district}, ${street}, ${house}\nWe will contact you at ${phone}.`
      );
      setLoading(false);
      router.push("/"); // Home ga redirect
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-6 md:p-16">
      <h1 className="text-4xl font-extrabold text-pink-700 mb-10 text-center">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* CART SUMMARY */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Cart
          </h2>
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-contain rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-600">Color: {item.color}</p>
                  <p className="text-gray-600">Size: {item.size}</p>
                  <p className="text-pink-700 font-bold">${item.price}</p>
                </div>
                <div>
                  <span className="text-gray-500">x{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xl font-semibold text-gray-800">
            Total: <span className="text-pink-700">${totalPrice}</span>
          </p>
        </div>

        {/* PAYMENT & LOCATION FORM */}
        <form
          onSubmit={handlePurchase}
          className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col gap-4"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Delivery Info
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {/* LOCATION FIELDS */}
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            className="px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            className="px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="House Number"
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            required
            className="px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
            Payment Info
          </h2>

          <input
            type="text"
            placeholder="Card Number (16 digits)"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
            }
            maxLength={16}
            required
            className="px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Card PIN"
            value={cardPIN}
            onChange={(e) => setCardPIN(e.target.value)}
            required
            className="px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-pink-600 text-white py-3 rounded-2xl font-bold hover:bg-pink-700 transition transform hover:scale-105"
          >
            {loading ? "Processing..." : "Confirm Purchase"}
          </button>
        </form>
      </div>
    </main>
  );
}
