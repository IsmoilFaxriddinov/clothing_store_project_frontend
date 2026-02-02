"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Test alert
      setTimeout(() => {
        alert(
          `User Registered!\nFull Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}`
        );
        setLoading(false);
        router.push("/"); // <-- Home page ga redirect
      }, 800);
    } catch (err) {
      setError("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-8 text-center">
          Register
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {[
            { label: "Full Name", type: "text", value: fullName, setValue: setFullName, placeholder: "Enter your full name" },
            { label: "Email", type: "email", value: email, setValue: setEmail, placeholder: "Enter your email" },
            { label: "Password", type: "password", value: password, setValue: setPassword, placeholder: "Enter your password" },
            { label: "Phone Number", type: "tel", value: phone, setValue: setPhone, placeholder: "Enter your phone number" },
          ].map((field) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <label className="text-gray-900 font-bold mb-1">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4 bg-pink-600 text-white py-3 rounded-2xl font-bold hover:bg-pink-700 transition transform"
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

        <p className="mt-4 text-gray-500 text-center">
          Already have an account?{" "}
          <span
            className="text-pink-600 font-semibold cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}
