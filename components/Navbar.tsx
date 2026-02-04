"use client";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const { cart } = useCart(); // cart uzunligini olamiz

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

          {/* Checkout button with count */}
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
        </div>
      </div>
    </nav>
  );
}
