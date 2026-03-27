"use client";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { getDictionary, Lang } from "../app/lib/i18n";
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

  // ====================== Type-safe ======================
  const changeLang = (newLang: Lang) => {
    setLang(newLang);
    router.push(`${pathname}?lang=${newLang}`);
    setOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-blue-100 text-gray-600 px-4 sm:px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Left */}
        <div className="flex items-center gap-2">
          <Link href={`/?lang=${lang}`} onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="Logo" className="h-12 w-20" />
          </Link>

          <Link
            href={`/?lang=${lang}`}
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-sm font-semibold hover:bg-white/20 transition"
          >
            <FiHome />
            <span>{t.home}</span>
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <select
            value={lang}
            onChange={(e) => changeLang(e.target.value as Lang)}
            className="h-10 px-2 rounded-xl bg-white/10 border border-white/10 text-gray-700 text-sm"
          >
            <option value="uz">UZ</option>
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>

          <button onClick={() => setOpen((v) => !v)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          
          {/* HOME */}
          <Link
            href={`/?lang=${lang}`}
            className={`hover:text-[#1e3a8a] transition ${
              isActive("/") ? "text-[#1e3a8a] font-semibold" : ""
            }`}
          >
            {t.home}
          </Link>

          {/* PRODUCTS */}
          <Link
            href={`/products?lang=${lang}`}
            className={`hover:text-[#1e3a8a] transition ${
              isActive("/products") ? "text-[#1e3a8a] font-semibold" : ""
            }`}
          >
            {t.products}
          </Link>

          {/* CHECKOUT */}
          <Link
            href={`/checkout?lang=${lang}`}
            className="relative flex items-center gap-2 hover:text-[#1e3a8a] transition"
          >
            <FiShoppingCart />
            <span>{t.checkout}</span>

            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#1e3a8a] text-black px-1 text-xs rounded-full animate-pulse">
                {cart.length}
              </span>
            )}
          </Link>

          {/* PROFILE */}
          <Link
            href={`/profile?lang=${lang}`}
            className={`hover:text-[#1e3a8a] transition ${
              isActive("/profile") ? "text-[#1e3a8a] font-semibold" : ""
            }`}
          >
            {t.profile}
          </Link>

          {/* LANG */}
          <select
            value={lang}
            onChange={(e) => changeLang(e.target.value as Lang)}
            className="bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20 transition"
          >
            <option value="uz" className="text-black">UZ</option>
            <option value="ru" className="text-black">RU</option>
            <option value="en" className="text-black">EN</option>
          </select>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-3">
          <div className="bg-gray-950/80 rounded-2xl p-3 flex flex-col gap-3 animate-fade-in text-white">
            
            <Link href={`/?lang=${lang}`} onClick={() => setOpen(false)}>
              {t.home}
            </Link>

            <Link href={`/products?lang=${lang}`} onClick={() => setOpen(false)}>
              {t.products}
            </Link>

            <Link href={`/checkout?lang=${lang}`} onClick={() => setOpen(false)}>
              {t.checkout}
            </Link>

            <Link href={`/profile?lang=${lang}`} onClick={() => setOpen(false)}>
              {t.profile}
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}