"use client";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { getDictionary } from "../app/lib/i18n";
import { useLang } from "../app/context/LangContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { cart } = useCart();
  const { lang, setLang } = useLang();
  const t = getDictionary(lang);

  const router = useRouter();
  const pathname = usePathname();

  const changeLang = (newLang: string) => {
    setLang(newLang);
    router.push(`${pathname}?lang=${newLang}`);
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link href={`/?lang=${lang}`} className="text-2xl font-bold">
          KidsShop
        </Link>

        {/* Menu */}
        <div className="space-x-6 flex items-center">

          <Link
            href={`/?lang=${lang}`}
            className="hover:text-pink-500 transition-colors"
          >
            {t.home}
          </Link>

          <Link
            href={`/products?lang=${lang}`}
            className="hover:text-pink-500 transition-colors"
          >
            {t.products}
          </Link>

          <Link
            href={`/checkout?lang=${lang}`}
            className="hover:text-pink-500 transition-colors relative"
          >
            {t.checkout}

            {cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          <Link
            href={`/profile?lang=${lang}`}
            className="hover:text-pink-500 transition-colors"
          >
            {t.profile}
          </Link>

          {/* Language Select */}
          <select
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            className="ml-4 bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600 cursor-pointer"
          >
            <option value="uz">UZ</option>
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>

        </div>
      </div>
    </nav>
  );
}