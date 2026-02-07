import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "../app/context/CartContext";
import { AuthProvider } from "../app/context/AuthContext";
import { FavoriteProvider } from "../app/context/FavoriteContext";
import { CheckoutProvider } from "../app/context/CheckoutContext";

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
        <AuthProvider>
          <CheckoutProvider>
            <CartProvider>
              <FavoriteProvider>
                <Navbar />
                {/* Leaflet CSS endi globals.css orqali ishlaydi */}
                <main className="min-h-screen">{children}</main>
                <Footer />
              </FavoriteProvider>
            </CartProvider>
          </CheckoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
