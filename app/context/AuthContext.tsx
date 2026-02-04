"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  fullName: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  register: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  register: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const register = (userData: User) => {
    setUser(userData); // foydalanuvchini context-ga saqlaymiz
  };

  return (
    <AuthContext.Provider value={{ user, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
