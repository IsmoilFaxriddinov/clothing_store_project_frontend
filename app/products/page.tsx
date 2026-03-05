"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Product = {
  id: number; // ID qo‘shildi
  title: string;
  slug: string;
  category: string;
  price?: string;
  discount?: string;
  rating?: number;
  src?: string;
  colors?: string[];
  sizes?: string[];
  new?: boolean;
  ageGroup: string;
};

// ===== LOOKUP MAPS =====
const colorMap: Record<number, string> = {
  5: "Red", 6: "Blue", 7: "Green", 8: "Yellow",
  9: "Black", 10: "Gray", 11: "Blue", 12: "Brown",
  13: "Orange", 14: "Purple", 15: "White", 16: "Pink",
};
const sizeMap: Record<number, string> = {
  5: "S", 6: "M", 7: "L", 8: "XL", 9: "XS", 10: "M",
  11: "S", 12: "L", 13: "M", 14: "L", 15: "XL", 16: "S", 17: "M",
};

export default function ProductsPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAge, setSelectedAge] = useState<string>("");

  // ================== FETCH PRODUCTS ==================
  useEffect(() => {
    fetch("http://localhost:1337/api/products/all")
      .then((res) => res.json())
      .then((data) => {
        const mapped: Product[] = data.map((p: any) => ({
          id: p.id, // ID qo‘shildi
          title: p.title,
          slug: p.slug || p.title.toLowerCase().replace(/\s+/g, "-"),
          category: p.category?.name || "unknown",
          price: p.price ? `$${p.price}` : undefined,
          discount: p.discount_price ? `$${p.discount_price}` : undefined,
          rating: 4,
          src: p.image_1?.[0]?.url
            ? `http://localhost:1337${p.image_1[0].url}`
            : "/placeholder.png",
          colors: p.colors?.map((c: any) => c.name || colorMap[c.id]).filter(Boolean) || [],
          sizes: p.sizes?.map((s: any) => s.name || sizeMap[s.id]).filter(Boolean) || [],
          new: false,
          ageGroup: p.ages?.length
            ? p.ages.map((a: any) => a.name).join(", ")
            : "All", // default "All" bo‘sh ages uchun
        }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const ageGroups = ["All", "3-5", "5-7", "6-8", "9-12"];

  // ================== FILTER PRODUCTS ==================
  const finalProducts = products.filter((p) => {
    const slugMatch = !slug || p.category.toLowerCase() === slug.toLowerCase();
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some(
        (cat) => cat.toLowerCase() === p.category.toLowerCase()
      );

    const sizeMatch =
      selectedSizes.length === 0 ||
      (p.sizes &&
        p.sizes.some((size) =>
          selectedSizes.map((s) => s.toUpperCase()).includes(size.toUpperCase())
        ));

    const colorMatch =
      selectedColors.length === 0 ||
      (p.colors &&
        p.colors.some((color) =>
          selectedColors.map((c) => c.toLowerCase()).includes(color.toLowerCase())
        ));

    let ageMatch = true;
    if (selectedAge && selectedAge !== "All") {
      const parseAge = (str: string) => {
        const match = str.match(/(\d+)-(\d+)/);
        return match ? [parseInt(match[1]), parseInt(match[2])] : [0, 100];
      };
      const [prodMin, prodMax] = parseAge(p.ageGroup);
      const [selMin, selMax] = parseAge(selectedAge);
      ageMatch = prodMax >= selMin && prodMin <= selMax;
    }

    return slugMatch && categoryMatch && sizeMatch && colorMatch && ageMatch;
  });

  if (loading) return <div className="text-center mt-20">Loading products...</div>;

  // ================== RENDER ==================
  return (
    <main className="bg-gradient-to-b from-pink-50 to-blue-50 min-h-screen text-gray-900 px-6 md:px-16 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-pink-700">
        {slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "All"} Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* FILTER PANEL */}
        <aside className="bg-white rounded-3xl shadow-xl p-6 h-fit sticky top-24">
          {/* CATEGORY FILTER */}
          <h3 className="font-bold text-lg mb-4 text-pink-700">Category</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() =>
                  setSelectedCategories(
                    selectedCategories.includes(cat)
                      ? selectedCategories.filter((c) => c !== cat)
                      : [...selectedCategories, cat]
                  )
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full border capitalize transition font-semibold ${
                  selectedCategories.includes(cat)
                    ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white border-pink-500"
                    : "border-gray-300 hover:bg-pink-100"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* SIZE FILTER */}
          <h3 className="font-bold text-lg mb-4 text-pink-700">Size</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {["S", "M", "X", "L", "XL"].map((size) => (
              <motion.button
                key={size}
                onClick={() =>
                  setSelectedSizes(
                    selectedSizes.includes(size)
                      ? selectedSizes.filter((s) => s !== size)
                      : [...selectedSizes, size]
                  )
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full border transition font-semibold ${
                  selectedSizes.includes(size)
                    ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white border-pink-500"
                    : "border-gray-300 hover:bg-pink-100"
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>

          {/* COLOR FILTER */}
          <h3 className="font-bold text-lg mb-4 text-pink-700">Color</h3>
          <div className="flex gap-3 flex-wrap mb-6">
            {["Red", "Blue", "Green", "Yellow", "Black", "White", "Pink", "Purple"].map(
              (c) => (
                <motion.button
                  key={c}
                  onClick={() =>
                    setSelectedColors(
                      selectedColors.includes(c)
                        ? selectedColors.filter((col) => col !== c)
                        : [...selectedColors, c]
                    )
                  }
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 rounded-full border-2 transition shadow-md ${
                    selectedColors.includes(c)
                      ? "border-black scale-110"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: c.toLowerCase() }}
                />
              )
            )}
          </div>

          {/* AGE FILTER */}
          <h3 className="font-bold text-lg mb-4 text-pink-700">Age</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {ageGroups.map((age) => (
              <motion.button
                key={age}
                onClick={() => setSelectedAge(selectedAge === age ? "" : age)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full border font-semibold transition ${
                  selectedAge === age
                    ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white border-pink-500"
                    : "border-gray-300 hover:bg-pink-100"
                }`}
              >
                {age}
              </motion.button>
            ))}
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {finalProducts.map((product) => (
            <motion.div
              key={product.id} // slug o‘rniga ID
              onClick={() =>
                router.push(`/categories/products/${product.id}`) // ID bo‘yicha
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-3xl shadow-lg p-6 text-center cursor-pointer overflow-hidden relative group"
            >
              {product.new && (
                <span className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 text-xs rounded-full font-bold z-10">
                  NEW
                </span>
              )}

              {/* IMAGE */}
              <div className="w-full h-64 mx-auto mb-4 relative">
                <img
                  src={product.src}
                  alt={product.title}
                  className="w-full h-full object-contain rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-inner"
                />
              </div>

              {/* TITLE */}
              <h3 className="font-bold text-lg mb-2">{product.title}</h3>

              {/* PRICE */}
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className="text-pink-700 font-extrabold text-xl">
                  {product.discount ? product.discount : product.price}
                </span>
                {product.discount && (
                  <span className="text-gray-400 line-through">
                    {product.price}
                  </span>
                )}
              </div>

              {/* ADD TO CART */}
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold transition transform hover:scale-105">
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}