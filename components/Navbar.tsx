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
          <Link href="/categories" className="hover:text-pink-500 transition-colors">
            Categories
          </Link>
          <Link href="/about" className="hover:text-pink-500 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-pink-500 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
