"use client";
export const dynamic = "force-dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  images?: string[];
  colors?: string[];
  sizes?: string[];
  new?: boolean;
  ages?: string[];
};

function parseAgeRange(str: string): [number, number] {
  const nums = (str.match(/\d+/g) || []).map(Number);
  if (nums.length >= 2) {
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    return [min, max];
  }
  if (nums.length === 1) return [nums[0], nums[0]];
  return [0, 100];
}

function normalizeStringArray(input: any): string[] {
  if (!Array.isArray(input)) return [];
  return input.map((x) => String(x || "").trim()).filter(Boolean);
}

function normalizeNameArray(input: any): string[] {
  if (!input) return [];
  const list = Array.isArray(input) ? input : input?.data;
  if (!Array.isArray(list)) return [];
  return list
    .map((x: any) => x?.attributes?.name ?? x?.name ?? x)
    .map((x: any) => String(x || "").trim())
    .filter(Boolean);
}

function normalizeCollectionNames(json: any): string[] {
  const list = Array.isArray(json) ? json : json?.data;
  if (!Array.isArray(list)) return [];
  return list
    .map((item: any) => item?.attributes?.name ?? item?.name)
    .map((x: any) => String(x || "").trim())
    .filter(Boolean);
}

// ================== FINAL PRICE FUNCTION ==================
const ITEMS_PER_PAGE = 6;

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [onlyDiscount, setOnlyDiscount] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ageOptions, setAgeOptions] = useState<string[]>([]);
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [hoverImageById, setHoverImageById] = useState<Record<number, number>>({});
  const hoverTimersRef = useRef<Record<number, number>>({});

  // ================== FETCH PRODUCTS ==================
  useEffect(() => {
  fetch("http://localhost:1337/api/products/all")
    .then(res => res.json())
    .then(data => {
      const mapped: Product[] = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug || p.title.toLowerCase().replace(/\s+/g, "-"),
        category: lang === "en" ? p.category?.name || t.unknown_category : lang === "ru" ? p.category?.name_ru || t.unknown_category : p.category?.name_uz || t.unknown_category,
        price: p.price ? `$${p.price}` : undefined,
        discount: p.discount_price !== null ? `${p.discount_price}` : undefined,
        discount_category: p.category?.discount_category || 0,
        rating: 4,
        images: ["image_1", "image_2", "image_3", "image_4", "image_5"]
          .flatMap((k) =>
            Array.isArray(p?.[k]) ? p[k].map((img: any) => img?.url) : []
          )
          .filter(Boolean)
          .map((url: string) => `http://localhost:1337${url}`),
        src: p.image_1?.[0]?.url
          ? `http://localhost:1337${p.image_1[0].url}`
          : "/placeholder.png",
        colors: normalizeNameArray(p.colors),
        sizes: normalizeNameArray(p.sizes ?? p.sizes),
        new: false,
        ages: normalizeNameArray(p.ages),
      }));
      setProducts(mapped);
      setLoading(false);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setLoading(false);
    });
}, [lang, t]);

  useEffect(() => {
    return () => {
      const timers = hoverTimersRef.current;
      Object.values(timers).forEach((id) => window.clearTimeout(id));
      hoverTimersRef.current = {};
    };
  }, []);

  // ================== FETCH AGE OPTIONS ==================
  useEffect(() => {
    const fetchAges = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/ages");
        const json: any = await res.json();

        const names = normalizeCollectionNames(json);

        const unique = Array.from(new Set(names)).sort((a, b) => {
          const [aMin] = parseAgeRange(a);
          const [bMin] = parseAgeRange(b);
          return aMin - bMin;
        });

        setAgeOptions(unique);
      } catch (e) {
        console.error("Fetch ages error:", e);
        setAgeOptions([]);
      }
    };

    fetchAges();
  }, []);

  // ================== FETCH COLOR OPTIONS ==================
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/colors");
        const json: any = await res.json();
        setColorOptions(Array.from(new Set(normalizeCollectionNames(json))));
      } catch (e) {
        console.error("Fetch colors error:", e);
        setColorOptions([]);
      }
    };
    fetchColors();
  }, []);

  // ================== FETCH SIZE OPTIONS ==================
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/sizes");
        const json: any = await res.json();
        setSizeOptions(Array.from(new Set(normalizeCollectionNames(json))));
      } catch (e) {
        console.error("Fetch sizes error:", e);
        setSizeOptions([]);
      }
    };
    fetchSizes();
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category)));
  const availableColors =
    colorOptions.length > 0
      ? colorOptions
      : Array.from(new Set(products.flatMap(p => p.colors || [])));
  const availableSizes =
    sizeOptions.length > 0
      ? sizeOptions
      : Array.from(new Set(products.flatMap(p => p.sizes || [])));
  const ageGroups = [t.all_ages, ...ageOptions];

  const buildQuery = (next: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v) sp.delete(k);
      else sp.set(k, v);
    });
    return sp.toString();
  };

  // URL -> state (category/size/color/age/discount/search)
  useEffect(() => {
    if (categories.length === 0) return;

    let qpCategory = searchParams.get("category") || "";
    const qpSize = searchParams.get("size") || "";
    const qpColor = searchParams.get("color") || "";
    const qpAge = searchParams.get("age") || "";
    const qpQ = searchParams.get("q") || "";
    const qpOnlyDiscount = searchParams.get("discount") || "";

    // Agar URL'da category bo'lmasa, home'dan sessionStorage orqali keladi (URL o'zgarmaydi)
    if (!qpCategory) {
      try {
        const stored = sessionStorage.getItem("products_category") || "";
        if (stored) {
          qpCategory = stored;
          sessionStorage.removeItem("products_category");
        }
      } catch {}
    }

    // Param yo'q bo'lsa ham state'ni tozalab turamiz (loop bug bo'lmasin)
    setSelectedSizes(qpSize ? qpSize.split(",").filter(Boolean) : []);
    setSelectedColors(qpColor ? qpColor.split(",").filter(Boolean) : []);
    setSelectedAge(qpAge || "");
    setSearchTerm(qpQ);
    setOnlyDiscount(qpOnlyDiscount === "1" || qpOnlyDiscount === "true");

    if (!qpCategory) {
      setSelectedCategories([]);
    } else {
      const requested = qpCategory.split(",").filter(Boolean);
      const matched = requested
        .map((req) => {
          const reqNorm = req.toLowerCase().replace(/\s+/g, "-");
          return categories.find((c) => {
            const catNorm = c.toLowerCase().replace(/\s+/g, " ");
            return (
              catNorm === reqNorm ||
              catNorm.replace(/\s/g, "-") === reqNorm ||
              catNorm.includes(reqNorm) ||
              reqNorm.includes(catNorm.replace(/\s/g, ""))
            );
          });
        })
        .filter(Boolean) as string[];
      setSelectedCategories(matched);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.join(","), searchParams.toString()]);

  // state -> URL (category/size/color/age/discount)  (lang saqlanadi)
  useEffect(() => {
    if (loading) return;

    const categoryParam =
      selectedCategories.length > 0
        ? selectedCategories
            .map((c) => c.toLowerCase().replace(/\s+/g, "-"))
            .join(",")
        : undefined;
    const sizeParam = selectedSizes.length > 0 ? selectedSizes.join(",") : undefined;
    const colorParam = selectedColors.length > 0 ? selectedColors.join(",") : undefined;
    const ageParam = selectedAge && selectedAge !== t.all_ages ? selectedAge : undefined;
    const discountParam = onlyDiscount ? "1" : undefined;
    const qParam = searchTerm.trim() ? searchTerm.trim() : undefined;

    const query = buildQuery({
      lang,
      category: categoryParam,
      size: sizeParam,
      color: colorParam,
      age: ageParam,
      q: qParam,
      discount: discountParam,
    });

    if (query !== searchParams.toString()) {
      router.replace(`/products?${query}`);
    }
  }, [
    loading,
    lang,
    t.all_ages,
    selectedCategories.join("|"),
    selectedSizes.join("|"),
    selectedColors.join("|"),
    selectedAge,
    searchTerm,
    onlyDiscount,
  ]);

  // ================== CATEGORY DISCOUNT MAP ==================
  const categoryDiscountMap: Record<string, number> = {};
  products.forEach(p => {
    if (!categoryDiscountMap[p.category] || p.discount_category > categoryDiscountMap[p.category]) {
      categoryDiscountMap[p.category] = p.discount_category;
    }
  });

  // ================== FILTERED PRODUCTS ==================
  const finalProducts = products
  .filter(p => {
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

    const slugMatch =
      !slug ||
      slug
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .some((s) => norm(p.category) === norm(s));

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
      const prodAges = p.ages?.length ? p.ages : [];
      const norm = (s: string) => String(s || "").trim().toLowerCase();
      ageMatch =
        prodAges.length > 0 &&
        prodAges.some((a) => norm(a) === norm(selectedAge));
    }

    // 🔥 FIX: category discount ham hisoblanadi
    const discountMatch =
      !onlyDiscount ||
      (
        (p.discount && parseFloat(p.discount) > 0) ||
        categoryDiscountMap[p.category] > 0
      );

    const q = searchTerm.trim().toLowerCase();
    const searchMatch = !q || p.title.toLowerCase().includes(q);

    return slugMatch && categoryMatch && sizeMatch && colorMatch && ageMatch && discountMatch && searchMatch;
  })

  // 🔥 SORT QO‘SHILDI
  .sort((a, b) => {
    const getDiscount = (p: Product) => {
      if (p.discount) return parseFloat(p.discount);
      return categoryDiscountMap[p.category] || 0;
    };

    const getPrice = (p: Product) => {
      if (!p.price) return 0;
      return parseFloat(p.price.replace("$", ""));
    };

    const discountA = getDiscount(a);
    const discountB = getDiscount(b);

    // 1️⃣ katta chegirma tepada
    if (discountA !== discountB) {
      return discountB - discountA;
    }

    // 2️⃣ keyin qimmatdan arzon
    return getPrice(b) - getPrice(a);
  });

  const totalPages = Math.max(1, Math.ceil(finalProducts.length / ITEMS_PER_PAGE));
  const currentPageIndex = Math.min(currentPage, totalPages);
  const paginatedProducts = finalProducts.slice(
    (currentPageIndex - 1) * ITEMS_PER_PAGE,
    currentPageIndex * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <main className="bg-gradient-to-b from-pink-50 to-blue-50 min-h-screen text-gray-900 px-6 md:px-16 py-12">
      {/* Mobile: filter toggle */}
      <div className="md:hidden mb-6">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="w-full bg-white rounded-2xl shadow px-4 py-3 font-semibold flex items-center justify-between"
        >
          <span>{t.category} / {t.size} / {t.color}</span>
          <span className="text-xl leading-none">{filtersOpen ? "×" : "≡"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* ================== FILTER PANEL ================== */}
        <aside
          className={[
            "bg-white rounded-3xl shadow-xl p-6 h-fit md:sticky md:top-1",
            "md:block",
            filtersOpen ? "block" : "hidden",
          ].join(" ")}
        >
          {/* Search */}
          <h3 className="font-bold text-sm mb-3 text-pink-700 uppercase tracking-wide">
            {t.search}
          </h3>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full mb-6 px-4 py-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
          />

          {/* Discount toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-sm text-pink-700 uppercase tracking-wide">
                {t.discount}
              </h3>
              <motion.button
                onClick={() => setOnlyDiscount(!onlyDiscount)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none ${
                  onlyDiscount ? "bg-gradient-to-r from-pink-500 to-indigo-500" : "bg-gray-300"
                }`}
                aria-label={t.discount}
              >
                <motion.span
                  layout
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: onlyDiscount ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>

            </div>

            <span className="text-sm font-medium text-gray-700">
              {onlyDiscount ? t.only_discounted : t.show_all}
            </span>
          </div>

          {/* CATEGORY FILTER */}
          <h3 className="font-bold text-sm mb-3 text-pink-700 uppercase tracking-wide">
  {t.category}
          </h3>

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
        className={`relative px-2 py-2 rounded-full border text-xs font-semibold transition ${
          isSelected
            ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white border-pink-500"
            : "border-gray-300 hover:bg-pink-100"
        }`}
      >
        {/* 🔴 DISCOUNT BADGE (tashqarida) */}
        {discount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow">
            -{discount}%
          </span>
        )}

        {/* ✅ CATEGORY NOMI */}
        <span>{cat}</span>

        {/* ✅ SELECTED ICON */}
        {isSelected && (
          <span className="ml-1 text-white font-bold">✓</span>
        )}
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
          <h3 className="font-bold text-sm mb-3 text-pink-700 uppercase tracking-wide">{t.age}</h3>
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
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {paginatedProducts.map(product => {
            const categoryDiscountPercent = categoryDiscountMap[product.category] || 0;
            const finalDiscountedPrice = getFinalPrice(product, categoryDiscountPercent);
            const finalDiscountPercent = product.discount
              ? parseFloat(product.discount)
              : categoryDiscountPercent;

            return (
              <motion.div
                key={product.id}
                onClick={() => router.push(`/categories/products/${product.id}`)}
                onMouseEnter={() => {
                  window.clearTimeout(hoverTimersRef.current[product.id]);
                  hoverTimersRef.current[product.id] = window.setTimeout(() => {
                    if ((product.images?.length || 0) > 1) {
                      setHoverImageById((prev) => ({ ...prev, [product.id]: 1 }));
                    }
                  }, 3500);
                }}
                onMouseLeave={() => {
                  window.clearTimeout(hoverTimersRef.current[product.id]);
                  setHoverImageById((prev) => {
                    const next = { ...prev };
                    delete next[product.id];
                    return next;
                  });
                }}
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

                <div className="w-full aspect-[3/3] mx-auto mb-4 relative">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={
                        typeof hoverImageById[product.id] === "number" &&
                        product.images?.[hoverImageById[product.id]]
                          ? product.images[hoverImageById[product.id]]
                          : product.src
                      }
                      src={
                        typeof hoverImageById[product.id] === "number" &&
                        product.images?.[hoverImageById[product.id]]
                          ? product.images[hoverImageById[product.id]]
                          : product.src
                      }
                      alt={product.title}
                      initial={{ x: -28, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 28, opacity: 0 }}
                      transition={{ duration: 0.32, ease: "easeOut" }}
                      className="absolute inset-0 w-full h-full object-contain rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-inner"
                    />
                  </AnimatePresence>
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

      {totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="inline-flex items-center rounded-full bg-white shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPageIndex === 1}
              className="px-4 py-2 text-sm font-semibold text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-semibold transition ${
                    currentPageIndex === page
                      ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white"
                      : "text-gray-700 hover:bg-pink-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPageIndex === totalPages}
              className="px-4 py-2 text-sm font-semibold text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Page {currentPageIndex} of {totalPages}
          </p>
        </div>
      )}
    </main>
  );
}