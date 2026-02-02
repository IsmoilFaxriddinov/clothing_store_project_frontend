import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          KidsShop
        </Link>

        {/* Menu */}
        <div className="space-x-6">
          <Link href="/" className="hover:text-pink-500 transition-colors">
            Home
          </Link>
          <Link href="/products" className="hover:text-pink-500 transition-colors">
            Products
          </Link>
          <Link href="/checkout" className="hover:text-pink-500 transition-colors">
            Checkout
          </Link>
          <Link href="/profile" className="hover:text-pink-500 transition-colors">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
