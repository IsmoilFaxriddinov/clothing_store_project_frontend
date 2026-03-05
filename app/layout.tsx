// app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "../app/context/CartContext";
import { AuthProvider } from "../app/context/AuthContext";
import { FavoriteProvider } from "../app/context/FavoriteContext";
import { CheckoutProvider } from "../app/context/CheckoutContext";
import { LangProvider } from "../app/context/LangContext"; // ✅ import qildik

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
        <LangProvider> {/* ✅ Barcha site bo‘ylab til context */}
          <AuthProvider>
            <CheckoutProvider>
              <CartProvider>
                <FavoriteProvider>
                  <Navbar />
                  <main className="min-h-screen">{children}</main>
                  <Footer />
                </FavoriteProvider>
              </CartProvider>
            </CheckoutProvider>
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}