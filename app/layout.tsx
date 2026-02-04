import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "../app/context/CartContext"; // cart context
import { AuthProvider } from "../app/context/AuthContext"; // auth context
import { FavoriteProvider } from "../app/context/FavoriteContext"; // favorite context

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
        <AuthProvider> {/* Avvalo AuthProvider */}
          <CartProvider> {/* CartProvider */}
            <FavoriteProvider> {/* <-- FavoriteProvider qo‘shildi */}
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </FavoriteProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
