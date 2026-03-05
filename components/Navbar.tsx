"use client";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { getDictionary } from "../app/lib/i18n";
import { useLang } from "../app/context/LangContext"; // ✅ context

export default function Navbar() {
  const { cart } = useCart();
  const { lang, setLang } = useLang(); // ✅ global lang
  const t = getDictionary(lang);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          KidsShop
        </Link>

        {/* Menu */}
        <div className="space-x-6 flex items-center">
          <Link href="/" className="hover:text-pink-500 transition-colors">
            Home
          </Link>

          <Link href="/products" className="hover:text-pink-500 transition-colors">
            Products
          </Link>

          <Link href="/checkout" className="hover:text-pink-500 transition-colors relative">
            Checkout
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          <Link href="/profile" className="hover:text-pink-500 transition-colors">
            Profile
          </Link>

          {/* Language buttons */}
          <div className="ml-4 flex space-x-2">
            <button
              onClick={() => setLang("uz")}
              className={`px-3 py-1 rounded-full border ${
                lang === "uz" ? "bg-white text-gray-900" : "bg-gray-700 text-white"
              } hover:bg-white hover:text-gray-900 transition-colors`}
            >
              UZ
            </button>
            <button
              onClick={() => setLang("ru")}
              className={`px-3 py-1 rounded-full border ${
                lang === "ru" ? "bg-white text-gray-900" : "bg-gray-700 text-white"
              } hover:bg-white hover:text-gray-900 transition-colors`}
            >
              RU
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-full border ${
                lang === "en" ? "bg-white text-gray-900" : "bg-gray-700 text-white"
              } hover:bg-white hover:text-gray-900 transition-colors`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}