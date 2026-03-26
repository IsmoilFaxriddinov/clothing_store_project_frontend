"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    // ✅ ADMIN CHECK
    setTimeout(() => {
      if (name === "admin" && password === "admin") {
        router.push("/admin/stats"); // ✅ redirect
      } else {
        setError("Invalid admin credentials");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-4xl font-extrabold text-pink-700 mb-8 text-center">
          Admin login
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* NAME */}
          <div>
            <label className="text-gray-900 font-bold mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter admin name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-gray-900 font-bold mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4 bg-pink-600 text-white py-3 rounded-2xl font-bold hover:bg-pink-700"
          >
            {loading ? "Checking..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}