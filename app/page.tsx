"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "./context/LangContext"; // ✅ global lang
import { getDictionary } from "./lib/i18n"; // dictionary

type Product = {
  id: number;
  title: string;
  slug: string;
  image: string;
  category: string;
  categorySlug: string;
  price?: number;
};

type PublicStats = {
  // product-based
  totalProducts: number;
  inStock: number;
  colors: number;
  sizes: number;
  ages: number;
  // order-based (optional)
  ordersCount?: number;
  soldItems?: number;
  revenue?: number;
  discountTotal?: number;
};

export default function Home() {
  const router = useRouter();
  const { lang } = useLang(); // ✅ global lang
  const t = getDictionary(lang); // dictionary

  const heroSlides = [
    { title: t.hero_title_1, desc: t.hero_desc_1, image: "/hero1.png" },
    { title: t.hero_title_2, desc: t.hero_desc_2, image: "/hero2.png" },
    { title: t.hero_title_3, desc: t.hero_desc_3, image: "/hero3.png" },
  ];

  const categories = [
    { title: t.cat_pants, src: "/category-pants.png", slug: "pants" },
    { title: t.cat_shoes, src: "/category-shoes.png", slug: "shoes" },
    { title: t.cat_jackets, src: "/category-jackets.png", slug: "jackets" },
    { title: t.cat_accessories, src: "/category-accessories.png", slug: "accessories" },
    { title: t.cat_dresses, src: "/product-dress.png", slug: "dresses" },
    { title: t.cat_tshirts, src: "/product-shirt.png", slug: "tshirts" },
  ];

  const [products, setProducts] = useState<Product[]>([]); // ✅ state for backend products
  const [active, setActive] = useState(0);
  const [stats, setStats] = useState<PublicStats | null>(null);

  // HERO slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // FETCH products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          "http://localhost:1337/api/products/all"
        );
        const data = await res.json();

        const formatted: Product[] = data.slice(0, 4).map((p: any) => {
          const categoryName =
            lang === "en"
              ? p.category?.name || t.unknown_category
              : lang === "ru"
              ? p.category?.name_ru || t.unknown_category
              : p.category?.name_uz || t.unknown_category;

          const categorySlug = (categoryName || "")
            .toLowerCase()
            .replace(/\s+/g, "-");

          return {
            id: p.id,
            title: p.title,
            slug: p.slug || p.title.toLowerCase().replace(/\s+/g, "-"),
            price: p.price,
            image: p.image_1?.[0]?.url
              ? `http://localhost:1337${p.image_1[0].url}`
              : "/placeholder.png",
            category: categoryName,
            categorySlug,
          };
        });

        setProducts(formatted);
      } catch (err) {
        console.log("Product fetch error:", err);
      }
    }

    fetchProducts();
  }, [lang, t]);

  // PUBLIC STATS (computed from products + optional orders)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/products/all");
        if (!res.ok) return;
        const list = await res.json();
        if (!Array.isArray(list)) return;

        const totalProducts = list.length;
        const inStock = list.filter((p: any) => Boolean(p?.inStock)).length;

        const normNames = (arr: any) =>
          (Array.isArray(arr) ? arr : [])
            .map((x: any) => x?.attributes?.name ?? x?.name ?? x)
            .map((x: any) => String(x || "").trim())
            .filter(Boolean);

        const colors = new Set(list.flatMap((p: any) => normNames(p?.colors ?? p?.color))).size;
        const sizes = new Set(list.flatMap((p: any) => normNames(p?.sizes ?? p?.size))).size;
        const ages = new Set(list.flatMap((p: any) => normNames(p?.ages))).size;

        // try orders endpoints (if exists)
        let ordersList: any[] | null = null;
        const orderUrls = [
          "http://localhost:1337/api/orders",
          "http://localhost:1337/api/orders/all",
          "http://localhost:1337/api/order/all",
          "http://localhost:1337/api/all-orders",
        ];

        for (const url of orderUrls) {
          try {
            const r = await fetch(url);
            if (!r.ok) continue;
            const j = await r.json();
            const maybe = Array.isArray(j) ? j : j?.data;
            if (Array.isArray(maybe)) {
              ordersList = maybe;
              break;
            }
          } catch {
            // ignore
          }
        }

        if (ordersList) {
          const asNum = (v: any) => {
            const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
            return Number.isFinite(n) ? n : 0;
          };
          const normItems = (items: any): any[] =>
            Array.isArray(items) ? items : Array.isArray(items?.items) ? items.items : [];

          const ordersCount = ordersList.length;
          const soldItems = ordersList.reduce((sum, o) => {
            const items = normItems(o?.items ?? o?.attributes?.items);
            const qty = items.reduce((s, it) => s + asNum(it?.quantity ?? it?.qty ?? 1), 0);
            return sum + qty;
          }, 0);

          const revenue = ordersList.reduce(
            (sum, o) => sum + asNum(o?.final_price ?? o?.attributes?.final_price),
            0
          );
          const discountTotal = ordersList.reduce((sum, o) => {
            const disc = asNum(o?.discount ?? o?.attributes?.discount);
            if (disc) return sum + disc;
            const total = asNum(o?.total_price ?? o?.attributes?.total_price);
            const final = asNum(o?.final_price ?? o?.attributes?.final_price);
            return sum + Math.max(0, total - final);
          }, 0);

          setStats({
            totalProducts,
            inStock,
            colors,
            sizes,
            ages,
            ordersCount,
            soldItems,
            revenue,
            discountTotal,
          });
        } else {
          setStats({ totalProducts, inStock, colors, sizes, ages });
        }
      } catch {
        // ignore
      }
    };
    fetchStats();
  }, []);

  const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } };

  return (
    <main className="bg-white text-gray-900 font-sans">
      {/* HERO SLIDER */}
      <section className="relative min-h-[100svh] md:h-screen flex items-center px-4 sm:px-6 md:px-20 overflow-hidden pt-24 md:pt-0">
        {/* Mobile background overlay for readability */}
        <div className="absolute inset-0 md:hidden bg-gradient-to-b from-white/65 via-white/35 to-white/75" />

        <motion.img
          key={heroSlides[active].image}
          src={heroSlides[active].image}
          alt="Kids fashion"
          className="absolute inset-0 w-full h-full object-contain opacity-45 contrast-110 saturate-110 md:opacity-90 md:contrast-100 md:saturate-100 md:inset-y-0 md:right-0 md:left-auto md:w-auto md:h-[100%] pointer-events-none select-none"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />

        <motion.div
          {...fadeIn}
          className="relative z-10 max-w-xl w-full bg-white/85 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl md:shadow-none md:bg-transparent md:backdrop-blur-0 md:p-0"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase leading-tight whitespace-pre-line text-gray-900">
            {heroSlides[active].title}
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600">{heroSlides[active].desc}</p>
          <button
            onClick={() => router.push("/products")}
            className="mt-6 sm:mt-8 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full hover:scale-105 transform transition-all shadow-lg"
          >
            {t.shop_now}
          </button>
        </motion.div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {heroSlides.map((_, i) => (
            <span key={i} className={`w-3 h-3 rounded-full ${active === i ? "bg-indigo-500" : "bg-gray-300"} transition-all`} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 md:px-20 py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 uppercase text-gray-900 text-center">{t.category}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {categories.map((cat) => (
            <motion.div
              key={cat.slug}
              onClick={() => {
                try {
                  sessionStorage.setItem("products_category", cat.slug);
                } catch {}
                router.push(`/products?lang=${lang}`);
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="cursor-pointer bg-gray-50 p-6 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden"
            >
              <div className="overflow-hidden">
                <img src={cat.src} alt={cat.title} className="w-full h-40 object-contain transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-wide text-gray-900">{cat.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{t.shop_now_arrow}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURE SECTION 1 */}
      <section className="px-6 md:px-20 py-24 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-3xl my-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight text-gray-900">{t.built_title}</h2>
            <p className="mt-6 text-lg text-gray-700 max-w-md">{t.built_desc}</p>
            <button
              onClick={() => router.push("/products")}
              className="mt-8 px-8 py-3 bg-indigo-500 text-white rounded-full hover:scale-105 transform transition-all shadow-lg"
            >
              {t.explore_collection}
            </button>
          </motion.div>
          <motion.img src="/nike2.png" alt="Active kids clothing" className="w-full h-[420px] object-contain" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} />
        </div>
      </section>

      {/* FEATURE SECTION 2 */}
      <section className="px-6 md:px-20 py-24 bg-gray-50">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.img src="/nike3.png" alt="Comfort kids wear" className="w-full h-[420px] object-contain" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} />
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight text-gray-900">{t.soft_title}</h2>
            <p className="mt-6 text-lg text-gray-700 max-w-md">{t.soft_desc}</p>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="px-4 sm:px-6 md:px-20 py-20 sm:py-24 md:py-28 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold uppercase mb-14 text-center text-gray-900">{t.favorites_title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-12">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              {t.loading_products}
            </p>
          ) : (
            products.map((item) => (
              <motion.div
                key={item.id}
                onClick={() =>
                  {
                    try {
                      sessionStorage.setItem("products_category", item.categorySlug);
                    } catch {}
                    router.push(`/products?lang=${lang}`);
                  }
                }
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group text-center bg-gray-50 p-3 sm:p-5 md:p-6 rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-44 sm:h-64 md:h-80 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl font-bold text-gray-900 line-clamp-2">
                  {item.title}
                </h3>
                {item.price && (
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-700 font-semibold">
                    ${item.price}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* PUBLIC STATS */}
      <section className="px-4 sm:px-6 md:px-20 pb-20 sm:pb-24 md:pb-28 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-gray-900 text-center mb-10">
            {t.stats_title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl p-6 shadow-xl border bg-gradient-to-br from-indigo-50 to-pink-50"
            >
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                {t.stats_total_products}
              </p>
              <p className="mt-3 text-4xl font-extrabold text-gray-900">
                {typeof stats?.totalProducts === "number"
                  ? `${stats.totalProducts} ${t.stats_unit_items}`
                  : "—"}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl p-6 shadow-xl border bg-gradient-to-br from-pink-50 to-yellow-50"
            >
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                {t.stats_in_stock}
              </p>
              <p className="mt-3 text-4xl font-extrabold text-gray-900">
                {typeof stats?.inStock === "number"
                  ? `${stats.inStock} ${t.stats_unit_items}`
                  : "—"}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl p-6 shadow-xl border bg-gradient-to-br from-emerald-50 to-sky-50"
            >
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                {t.stats_colors}
              </p>
              <p className="mt-3 text-4xl font-extrabold text-gray-900">
                {typeof stats?.colors === "number"
                  ? `${stats.colors} ${t.stats_unit_types}`
                  : "—"}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl p-6 shadow-xl border bg-gradient-to-br from-violet-50 to-blue-50"
            >
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                {t.stats_sizes}
              </p>
              <p className="mt-3 text-4xl font-extrabold text-gray-900">
                {typeof stats?.sizes === "number"
                  ? `${stats.sizes} ${t.stats_unit_types}`
                  : "—"}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl p-6 shadow-xl border bg-gradient-to-br from-orange-50 to-rose-50"
            >
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                {t.stats_ages}
              </p>
              <p className="mt-3 text-4xl font-extrabold text-gray-900">
                {typeof stats?.ages === "number"
                  ? `${stats.ages} ${t.stats_unit_types}`
                  : "—"}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}