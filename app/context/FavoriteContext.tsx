"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  category: string;
  slug: string;
  title: string;
  price: string;
  discount?: string;
  images: string[];
  description: string;
  colors: string[];
  sizes: string[];
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
      const exists = prev.some(
        (p) => p.category === product.category && p.slug === product.slug
      );
      if (exists) {
        return prev.filter(
          (p) => !(p.category === product.category && p.slug === product.slug)
        );
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
