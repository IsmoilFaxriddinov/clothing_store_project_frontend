export default function Footer() {
  return (
    <footer className="mt-auto bg-black">
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-10 text-center">

        {/* Title */}
        <h4 className="text-2xl font-extrabold tracking-wide text-white mb-2">
          KidsShop
        </h4>

        {/* Description */}
        <p className="text-gray-400 mb-5">
          Your one-stop shop for kids clothing and accessories.
        </p>

        {/* Divider */}
        <div className="w-24 h-[2px] bg-gray-700 mx-auto mb-5" />

        {/* Copyright */}
        <p className="text-sm text-gray-500">
          © 2026 <span className="text-white font-semibold">KidsShop</span>. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
