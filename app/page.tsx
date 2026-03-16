"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "../app/context/LangContext"; // ✅ global lang
import { getDictionary } from "../app/lib/i18n"; // dictionary

type Product = {
  id: number;
  title: string;
  slug: string;
  image: string;
  category: string;
  categorySlug: string;
  price?: number;
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
  ];

  const [products, setProducts] = useState<Product[]>([]); // ✅ state for backend products
  const [active, setActive] = useState(0);

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

  const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } };

  return (
    <main className="bg-white text-gray-900 font-sans">
      {/* HERO SLIDER */}
      <section className="relative h-screen flex items-center px-6 md:px-20 overflow-hidden">
        <motion.div {...fadeIn} className="z-10 max-w-xl">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase leading-tight whitespace-pre-line text-gray-900">
            {heroSlides[active].title}
          </h1>
          <p className="mt-6 text-lg text-gray-600">{heroSlides[active].desc}</p>
          <button
            onClick={() => router.push("/categories")}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full hover:scale-105 transform transition-all shadow-lg"
          >
            {t.shop_now}
          </button>
        </motion.div>

        <motion.img
          key={heroSlides[active].image}
          src={heroSlides[active].image}
          alt="Kids fashion"
          className="absolute right-0 top-0 h-[100%] object-contain opacity-90"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {heroSlides.map((_, i) => (
            <span key={i} className={`w-3 h-3 rounded-full ${active === i ? "bg-indigo-500" : "bg-gray-300"} transition-all`} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 md:px-20 py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 uppercase text-gray-900 text-center">{t.categories}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {categories.map((cat) => (
            <motion.div
              key={cat.slug}
              onClick={() => router.push(`/categories/products/${cat.slug}`)}
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
              onClick={() => router.push("/categories")}
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
      <section className="px-6 md:px-20 py-28 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold uppercase mb-14 text-center text-gray-900">{t.favorites_title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              {t.loading_products}
            </p>
          ) : (
            products.map((item) => (
              <motion.div
                key={item.id}
                onClick={() =>
                  router.push(`/products?category=${item.categorySlug}`)
                }
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group text-center bg-gray-50 p-6 rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="mt-6 text-xl font-bold text-gray-900">{item.title}</h3>
                {item.price && <p className="mt-2 text-gray-700 font-semibold">${item.price}</p>}
              </motion.div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}