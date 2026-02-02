"use client";

import { useState } from "react";

// Test uchun foydalanuvchi va orderlar
const mockUser = {
  fullName: "Ismoil Faxriddinov",
  email: "ismoil@example.com",
  phone: "+998901234567",
  password: "********",
  orders: [
    { id: 1, product: "Red Shoes", price: 30, date: "2026-01-30" },
    { id: 2, product: "Blue Jacket", price: 50, date: "2026-01-28" },
  ],
};

export default function ProfilePage() {
  const [user] = useState(mockUser);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 p-6 md:p-16">
      <h1 className="text-4xl font-extrabold text-pink-700 mb-10 text-center">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* USER INFO */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Info</h2>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-gray-500 font-semibold">Full Name</p>
              <p className="text-gray-900">{user.fullName}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">Phone</p>
              <p className="text-gray-900">{user.phone}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">Password</p>
              <p className="text-gray-900">{user.password}</p>
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h2>

          {user.orders.length === 0 ? (
            <p className="text-gray-500">You have no orders yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {user.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl shadow-inner"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{order.product}</p>
                    <p className="text-gray-500 text-sm">Date: {order.date}</p>
                  </div>
                  <p className="text-pink-700 font-bold">${order.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
