import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "../app/context/CartContext"; // contextni import qilyapmiz

export const metadata = {
  title: "KidsShop",
  description: "Kids clothing store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <CartProvider> {/* <-- Bu yerda barcha saytni cart context bilan o'rab oldik */}
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
