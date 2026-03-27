"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Page.tsx dagi product tipiga moslashtirilgan
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number; // original price
  discount_price?: number; // product discount %
  category_discount?: number; // category discount %
  images: string[];
  color: string[];
  sizes: string[];
  ages?: string[];
  slug: string;
  category: string;
}

interface FavoriteContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      // Productni id orqali tekshiramiz
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return context;
};