"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "../context/LangContext"; 
import { getDictionary } from "../lib/i18n";

type Product = {
  id: number;
  title: string;
  slug: string;
  category: string;
  price?: string; 
  discount?: string; 
  discount_category: number; 
  rating?: number;
  src?: string;
  colors?: string[];
  sizes?: string[];
  new?: boolean;
  ageGroup: string;
};

// ================== FINAL PRICE FUNCTION ==================
function getFinalPrice(product: Product, categoryDiscount: number) {
  if (!product.price) return undefined;

  const priceNum = parseFloat(product.price.replace("$", ""));
  let discountPercent = 0;

  if (product.discount) {
    discountPercent = parseFloat(product.discount);
  } else if (categoryDiscount > 0) {
    discountPercent = categoryDiscount;
  }

  const finalPrice = priceNum * (1 - discountPercent / 100);
  return `$${finalPrice.toFixed(2)}`;
}

export default function ProductsPage() {
  const { lang } = useLang();
  const t = getDictionary(lang);
  const params = useParams();
  const searchParams = useSearchParams();
  const slugFromParams = params?.slug as string | undefined;
  const slugFromQuery = searchParams.get("category");
  const slug = slugFromParams ?? slugFromQuery ?? undefined;
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [onlyDiscount, setOnlyDiscount] = useState<boolean>(false);

  // ================== FETCH PRODUCTS ==================
  useEffect(() => {
    fetch("http://localhost:1337/api/products/all")
      .then(res => res.json())
      .then(data => {
        const mapped: Product[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug || p.title.toLowerCase().replace(/\s+/g, "-"),
          category:
            lang === "en"
              ? p.category?.name || t.unknown_category
              : lang === "ru"
              ? p.category?.name_ru || t.unknown_category
              : p.category?.name_uz || t.unknown_category,
          price: p.price ? `$${p.price}` : undefined,
          discount: p.discount_price !== null ? `${p.discount_price}` : undefined,
          discount_category: p.category?.discount_category || 0,
          rating: 4,
          src: p.image_1?.[0]?.url
            ? `http://localhost:1337${p.image_1[0].url}`
            : "/placeholder.png",
          colors: p.color?.filter(Boolean) || [],
          sizes: p.sizes?.filter(Boolean) || [],
          new: false,
          ageGroup: p.ages?.length ? p.ages.map((a: any) => a.name).join(", ") : t.all_ages,
        }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [lang, t]);

  const categories = Array.from(new Set(products.map(p => p.category)));
  const availableColors = Array.from(new Set(products.flatMap(p => p.colors || [])));
  const availableSizes = Array.from(new Set(products.flatMap(p => p.sizes || [])));
  const ageGroups = [t.all_ages, "3-5", "5-7", "6-8", "9-12"];

  // URL dan category kelganda filterni avtomatik belgilash (home page productlardan kelganda)
  useEffect(() => {
    if (slug && categories.length > 0) {
      const slugNorm = slug.toLowerCase().replace(/\s+/g, "-");
      const matchedCategory = categories.find((c) => {
        const catNorm = c.toLowerCase().replace(/\s+/g, " ");
        return (
          catNorm === slugNorm ||
          catNorm.replace(/\s/g, "-") === slugNorm ||
          catNorm.includes(slugNorm) ||
          slugNorm.includes(catNorm.replace(/\s/g, ""))
        );
      });
      if (matchedCategory && !selectedCategories.includes(matchedCategory)) {
        setSelectedCategories([matchedCategory]);
      }
    }
  }, [slug, categories.join(",")]);

  // ================== CATEGORY DISCOUNT MAP ==================
  const categoryDiscountMap: Record<string, number> = {};
  products.forEach(p => {
    if (!categoryDiscountMap[p.category] || p.discount_category > categoryDiscountMap[p.category]) {
      categoryDiscountMap[p.category] = p.discount_category;
    }
  });

  // ================== FILTERED PRODUCTS ==================
  const finalProducts = products.filter(p => {
    const slugMatch = !slug || p.category.toLowerCase() === slug.toLowerCase();
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some(c => c.toLowerCase() === p.category.toLowerCase());
    const sizeMatch =
      selectedSizes.length === 0 ||
      p.sizes?.some(size =>
        selectedSizes.map(s => s.toUpperCase()).includes(size.toUpperCase())
      );
    const colorMatch =
      selectedColors.length === 0 ||
      p.colors?.some(color =>
        selectedColors.map(c => c.toLowerCase()).includes(color.toLowerCase())
      );
    let ageMatch = true;
    if (selectedAge && selectedAge !== t.all_ages) {
      const parseAge = (str: string) => {
        const nums = (str.match(/\d+/g) || []).map(Number);
        if (nums.length >= 2) {
          const min = Math.min(...nums);
          const max = Math.max(...nums);
          return [min, max] as [number, number];
        }
        return [0, 100] as [number, number];
      };
      const [prodMin, prodMax] = parseAge(p.ageGroup);
      const [selMin, selMax] = parseAge(selectedAge);
      ageMatch = prodMax >= selMin && prodMin <= selMax;
    }
    const discountMatch = !onlyDiscount || (p.discount && parseFloat(p.discount) > 0);
    return slugMatch && categoryMatch && sizeMatch && colorMatch && ageMatch && discountMatch;
  });

  if (loading) return <div className="text-center mt-20">{t.loading_products}</div>;

  return (
    <main className="bg-gradient-to-b from-pink-50 to-blue-50 min-h-screen text-gray-900 px-6 md:px-16 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-pink-700">
        {slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : t.all_products}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* ================== FILTER PANEL ================== */}
        <aside className="bg-white rounded-3xl shadow-xl p-6 h-fit sticky top-1">
          {/* Discount toggle */}
          <h3 className="font-bold text-lg mb-4 text-pink-700">{t.discount}</h3>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-700">{onlyDiscount ? t.only_discounted : t.show_all}</span>
              
              <motion.button
                onClick={() => setOnlyDiscount(!onlyDiscount)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none ${
                  onlyDiscount ? "bg-gradient-to-r from-pink-500 to-indigo-500" : "bg-gray-300"
                }`}
              >
                {/* The circle */}
                <motion.span
                  layout
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: onlyDiscount ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

          {/* CATEGORY FILTER */}
          <h3 className="font-bold text-sm mb-3 text-pink-700 uppercase tracking-wide">{t.category}</h3>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {categories.map(cat => {
              const isSelected = selectedCategories.includes(cat);
              const discount = categoryDiscountMap[cat] || 0;
              return (
                <motion.button
                  key={cat}
                  onClick={() =>
                    setSelectedCategories(
                      isSelected
                        ? selectedCategories.filter(c => c !== cat)
                        : [...selectedCategories, cat]
                    )
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2 py-1 rounded-full border text-xs font-semibold transition ${
                    isSelected
                      ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white border-pink-500"
                      : "border-gray-300 hover:bg-pink-100"
                  }`}
                >
                  <span className="leading-tight">{cat}</span>
                  {discount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      -{discount}% 
                    </span>
                  )}
                  {isSelected && <span className="ml-1 text-white font-bold">✓</span>}
                </motion.button>
              );
            })}
          </div>

          {/* SIZE FILTER */}
          <h3 className="font-bold text-sm mb-3 text-pink-700 uppercase tracking-wide">
            {t.size}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {availableSizes.map(size => {
              const isSelected = selectedSizes.includes(size);
              return (
                <motion.button
                  key={size}
                  onClick={() =>
                    setSelectedSizes(
                      isSelected
                        ? selectedSizes.filter(s => s !== size)
                        : [...selectedSizes, size]
                    )
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                    isSelected
                      ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white border-pink-500"
                      : "border-gray-300 hover:bg-pink-100"
                  }`}
                >
                  {size}
                  {isSelected && <span className="ml-1 text-white font-bold">✓</span>}
                </motion.button>
              );
            })}
          </div>

          {/* COLOR FILTER */}
          <h3 className="font-bold text-sm mb-3 text-pink-700 uppercase tracking-wide">
            {t.color}
          </h3>
          <div className="flex gap-2 flex-wrap mb-6">
            {availableColors.map(c => {
              const isSelected = selectedColors.includes(c);
              return (
                <motion.button
                  key={c}
                  onClick={() =>
                    setSelectedColors(
                      isSelected
                        ? selectedColors.filter(col => col !== c)
                        : [...selectedColors, c]
                    )
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 rounded-full border-2 relative transition flex items-center justify-center ${
                    isSelected ? "border-black ring-2 ring-pink-400" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: c.toLowerCase() }}
                >
                  {isSelected && (
                    <span className="absolute text-white font-bold text-[10px] top-0 right-0">✓</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* AGE FILTER */}
          <h3 className="font-bold text-lg mb-4 text-pink-700">{t.age}</h3>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {ageGroups.map(age => {
              const isSelected = selectedAge === age;
              return (
                <motion.button
                  key={age}
                  onClick={() => setSelectedAge(isSelected ? "" : age)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2 py-1 rounded-full border text-sm font-semibold transition ${
                    isSelected
                      ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white border-pink-500"
                      : "border-gray-300 hover:bg-pink-100"
                  }`}
                >
                  {age}
                  {isSelected && <span className="ml-1 text-white font-bold">✓</span>}
                </motion.button>
              );
            })}
          </div>
        </aside>

        {/* ================== PRODUCTS GRID ================== */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {finalProducts.map(product => {
            const categoryDiscountPercent = categoryDiscountMap[product.category] || 0;
            const finalDiscountedPrice = getFinalPrice(product, categoryDiscountPercent);
            const finalDiscountPercent = product.discount
              ? parseFloat(product.discount)
              : categoryDiscountPercent;

            return (
              <motion.div
                key={product.id}
                onClick={() => router.push(`/categories/products/${product.id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-3xl shadow-lg p-6 text-center cursor-pointer overflow-hidden relative group"
              >
                {product.new && (
                  <span className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 text-xs rounded-full font-bold z-10">
                    {t.new}
                  </span>
                )}

                {finalDiscountPercent > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-xs rounded-full font-bold z-10">
                    -{finalDiscountPercent}%
                  </span>
                )}

                <div className="w-full aspect-[3/4] mx-auto mb-4 relative">
                  <img
                    src={product.src}
                    alt={product.title}
                    className="w-full h-full object-contain rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-inner"
                  />
                </div>

                <h3 className="font-bold text-lg mb-2">{product.title}</h3>

                <div className="flex justify-center items-center gap-2 mb-4">
                  <span className="text-pink-700 font-extrabold text-xl">{finalDiscountedPrice}</span>
                  {finalDiscountPercent > 0 && (
                    <span className="text-gray-400 line-through">{product.price}</span>
                  )}
                </div>

                <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold transition transform hover:scale-105">
                  {t.add_to_cart}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}