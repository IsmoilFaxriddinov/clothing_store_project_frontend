"use client";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { getDictionary } from "../app/lib/i18n";
import { useLang } from "../app/context/LangContext";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { FiHome, FiMenu, FiX, FiShoppingCart } from "react-icons/fi";

export default function Navbar() {
  const { cart } = useCart();
  const { lang, setLang } = useLang();
  const t = getDictionary(lang);

  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const changeLang = (newLang: string) => {
    setLang(newLang);
    router.push(`${pathname}?lang=${newLang}`);
    setOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Left: logo + mobile home */}
        <div className="flex items-center gap-2">
          <Link
            href={`/?lang=${lang}`}
            className="text-2xl font-extrabold tracking-tight"
            onClick={() => setOpen(false)}
          >
            KidsShop
          </Link>

          {/* Mobile: always show Home */}
          <Link
            href={`/?lang=${lang}`}
            onClick={() => setOpen(false)}
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors text-sm font-semibold"
          >
            <FiHome className="text-lg" />
            <span>{t.home}</span>
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile: language always visible */}
          <select
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            aria-label="Language"
            className="h-10 px-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          >
            <option value="uz" className="text-black bg-white">UZ</option>
            <option value="ru" className="text-black bg-white">RU</option>
            <option value="en" className="text-black bg-white">EN</option>
          </select>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
          >
            {open ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href={`/?lang=${lang}`}
            className="hover:text-pink-400 transition-colors font-medium"
          >
            {t.home}
          </Link>

          <Link
            href={`/products?lang=${lang}`}
            className="hover:text-pink-400 transition-colors font-medium"
          >
            {t.products}
          </Link>

          <Link
            href={`/checkout?lang=${lang}`}
            className="hover:text-pink-400 transition-colors relative font-medium inline-flex items-center gap-2"
          >
            <FiShoppingCart className="text-lg" />
            <span>{t.checkout}</span>

            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-pink-500 text-white min-w-5 h-5 px-1 text-[11px] flex items-center justify-center rounded-full font-bold">
                {cart.length}
              </span>
            )}
          </Link>

          <Link
            href={`/profile?lang=${lang}`}
            className="hover:text-pink-400 transition-colors font-medium"
          >
            {t.profile}
          </Link>

          {/* Language Select */}
          <select
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            className="ml-2 bg-white/10 text-white px-3 py-2 rounded-xl border border-white/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          >
            <option value="uz" className="text-black bg-white">UZ</option>
            <option value="ru" className="text-black bg-white">RU</option>
            <option value="en" className="text-black bg-white">EN</option>
          </select>

        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden max-w-7xl mx-auto mt-3">
          <div className="bg-gray-950/80 border border-white/10 rounded-2xl p-3 backdrop-blur">
            <div className="grid gap-2">
              <Link
                href={`/?lang=${lang}`}
                className="px-3 py-3 rounded-xl hover:bg-white/10 transition-colors font-medium"
                onClick={() => setOpen(false)}
              >
                {t.home}
              </Link>
              <Link
                href={`/products?lang=${lang}`}
                className="px-3 py-3 rounded-xl hover:bg-white/10 transition-colors font-medium"
                onClick={() => setOpen(false)}
              >
                {t.products}
              </Link>
              <Link
                href={`/checkout?lang=${lang}`}
                className="px-3 py-3 rounded-xl hover:bg-white/10 transition-colors font-medium flex items-center justify-between"
                onClick={() => setOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <FiShoppingCart className="text-lg" />
                  {t.checkout}
                </span>
                {cart.length > 0 && (
                  <span className="bg-pink-500 text-white min-w-6 h-6 px-2 text-xs flex items-center justify-center rounded-full font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
              <Link
                href={`/profile?lang=${lang}`}
                className="px-3 py-3 rounded-xl hover:bg-white/10 transition-colors font-medium"
                onClick={() => setOpen(false)}
              >
                {t.profile}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}