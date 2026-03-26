// app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import { LangProvider } from "./context/LangContext"; // ✅ import qildik

export const metadata = {
  title: "Musaffo kids",
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