"use client";

import { createContext, useContext, useState } from "react";

type Product = {
  title: string;
  color?: string;
  size?: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  products: Product[];
  status: "Zakaz qabul qilindi" | "Yolga chiqdi" | "Yetib bordi va bajarildi";
};

type CheckoutContextType = {
  orders: Order[];
  addOrder: (order: {
    fullName: string;
    phone: string;
    address: string;
    products: Product[];
  }) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
};

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: {
    fullName: string;
    phone: string;
    address: string;
    products: Product[];
  }) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      status: "Zakaz qabul qilindi",
    };
    setOrders([newOrder, ...orders]);
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  return (
    <CheckoutContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout must be used within CheckoutProvider");
  return context;
};
