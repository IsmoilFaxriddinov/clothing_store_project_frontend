"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "./CartContext";

interface User {
  fullName: string;
  email: string;
  phone: string;
  purchases: CartItem[]; // xaridlar
}

interface AuthContextType {
  user: User | null;
  register: (userData: User) => void;
  addPurchase: (items: CartItem[]) => void; // yangi xarid qo‘shish
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  register: () => {},
  addPurchase: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const register = (userData: User) => {
    setUser(userData);
  };

  const addPurchase = (items: CartItem[]) => {
    if (!user) return;
    setUser({
      ...user,
      purchases: [...user.purchases, ...items],
    });
  };

  return (
    <AuthContext.Provider value={{ user, register, addPurchase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
