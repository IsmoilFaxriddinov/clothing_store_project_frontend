"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

type Stats = {
  totalOrders: number;
  deliveredOrders: number;
  onWayOrders: number;
  newOrders: number;

  totalRevenue: number;
  totalOriginalPrice: number;
  totalDiscountLoss: number;
  promoLoss: number;

  averageOrderValue: number;

  topProducts: [string, number][];

  // ✅ YANGI: backenddan keladi
  chart: {
    name: string;
    revenue: number;
  }[];
};

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [period, setPeriod] = useState("daily");

  useEffect(() => {
    fetch(`http://localhost:1337/api/orders/stats?period=${period}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, [period]);

  if (!stats) return <p className="p-10">Loading...</p>;

  // ✅ BACKEND CHART
  const chartData = stats.chart || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6 md:p-12">
      
      <h1 className="text-4xl font-bold mb-6 text-center">
        🚀 Admin Analytics
      </h1>

      {/* ===== PERIOD SWITCH ===== */}
      <div className="flex justify-center gap-3 mb-10">
        {["daily", "weekly", "monthly", "yearly"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm capitalize transition ${
              period === p
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ===== TOP CARDS ===== */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Revenue" value={stats.totalRevenue} trend="+12%" />
        <StatCard title="Orders" value={stats.totalOrders} trend="+5%" />
        <StatCard title="Loss" value={stats.totalDiscountLoss} trend="-8%" />
        <StatCard title="Promo" value={stats.promoLoss} trend="-3%" />
      </div>

      {/* ===== CHART ===== */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-10 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">📈 Revenue Growth</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#38bdf8"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== STATUS BAR ===== */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <ProgressCard title="Delivered" value={stats.deliveredOrders} color="bg-green-500" />
        <ProgressCard title="On Way" value={stats.onWayOrders} color="bg-yellow-500" />
        <ProgressCard title="New" value={stats.newOrders} color="bg-blue-500" />
      </div>

      {/* ===== TOP PRODUCTS ===== */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">🏆 Top Products</h2>

        {stats.topProducts?.map(([name, qty]) => (
          <div key={name} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{name}</span>
              <span>{qty}</span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full"
                style={{ width: `${(qty / 100) * 100}%` }} // xavfsiz
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// ================= STAT CARD =================
function StatCard({
  title,
  value,
  trend,
}: {
  title: string;
  value: number;
  trend: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl"
    >
      <h3 className="text-gray-300 text-sm">{title}</h3>

      <div className="flex justify-between items-center mt-2">
        <p className="text-2xl font-bold">${value}</p>
        <span className="text-green-400 text-sm">{trend}</span>
      </div>
    </motion.div>
  );
}

// ================= PROGRESS CARD =================
function ProgressCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  const max = 100;

  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl">
      <h3 className="mb-2">{title}</h3>

      <div className="w-full bg-gray-700 h-3 rounded-full">
        <div
          className={`${color} h-3 rounded-full`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>

      <p className="mt-2 text-sm">{value} orders</p>
    </div>
  );
}