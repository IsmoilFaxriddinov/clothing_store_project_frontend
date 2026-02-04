"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiFillHeart } from "react-icons/ai";
import { useCart } from "@/app/context/CartContext";
import { useFavorite } from "@/app/context/FavoriteContext"; // FavoriteContext

// Mahsulotlar ma'lumotlari
const products = [
  {
    category: "pants",
    slug: "red-pants",
    title: "Red Pants",
    price: "$20",
    discount: "$15",
    images: ["/product-pants.png", "/product-pantss.png", "/product-pants.png", "/product-pants.png"],
    description: "Comfortable red pants for kids. Soft and stylish.",
    colors: ["Red", "Blue"],
    sizes: ["S", "M", "L"],
    material: "Cotton",
    weight: "200g",
    ageGroup: "3-8 years",
  },
  {
    category: "pants",
    slug: "blue-pants",
    title: "Blue Pants",
    price: "$22",
    images: ["/product-pants2.png", "/product-pants.png", "/product-pants3.png", "/product-pants4.png"],
    description: "Classic blue pants for kids. Durable and comfy.",
    colors: ["Blue", "Green"],
    sizes: ["M", "L", "XL"],
    material: "Cotton Blend",
    weight: "220g",
    ageGroup: "4-9 years",
  },
  {
    category: "shoes",
    slug: "red-shoes",
    title: "Red Shoes",
    price: "$30",
    discount: "$25",
    images: ["/product-shoes.png", "/product-shoes2.png", "/product-shoes3.png", "/product-shoes4.png"],
    description: "Stylish red shoes for daily wear.",
    colors: ["Red"],
    sizes: ["M", "L"],
    material: "Synthetic",
    weight: "300g",
    ageGroup: "3-10 years",
  },
  {
    category: "jackets",
    slug: "blue-jacket",
    title: "Blue Jacket",
    price: "$50",
    images: ["/product-jacket.png", "/product-jacket2.png", "/product-jacket3.png", "/product-jacket4.png"],
    description: "Warm and comfy jacket for kids.",
    colors: ["Blue", "Green"],
    sizes: ["M", "L", "XL"],
    material: "Polyester",
    weight: "500g",
    ageGroup: "5-12 years",
  },
];

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorite(); // faqat bitta hook

  const product = products.find(
    (p) => p.category === params.slug && p.slug === params.productSlug
  );

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [liked, setLiked] = useState(false);

  // Component mount bo‘lganida, agar favorites da bo‘lsa liked true qilamiz
  useEffect(() => {
    if (product) {
      const isFavorite = favorites.some(
        (fav) => fav.category === product.category && fav.slug === product.slug
      );
      setLiked(isFavorite);
    }
  }, [favorites, product]);

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500 text-xl">
        Product not found
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Please select a color and size!");
      return;
    }

    addToCart({
      title: product.title,
      price: product.discount
        ? Number(product.discount.replace("$", ""))
        : Number(product.price.replace("$", "")),
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      image: product.images[0],
    });

    setAdding(true);

    setTimeout(() => {
      setAdding(false);
      router.push("/products");
    }, 1200);
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product);
    setLiked((prev) => !prev);
  };

  const similarProducts = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-6 md:p-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* IMAGE GALLERY */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <motion.img
            key={product.images[activeImage]}
            src={product.images[activeImage]}
            alt={product.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-[400px] md:h-[500px] object-contain rounded-2xl mb-4"
          />
          <div className="flex gap-3 justify-center">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-20 rounded-xl border overflow-hidden transition
                  ${activeImage === index
                    ? "border-pink-600 ring-2 ring-pink-400"
                    : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-pink-700 mb-2">{product.title}</h1>

          <div className="flex gap-3 mb-4 items-center">
            <span className="text-2xl font-extrabold text-pink-700">
              {product.discount ?? product.price}
            </span>
            {product.discount && (
              <span className="line-through text-gray-400">{product.price}</span>
            )}

            {/* ❤️ Yurakcha animatsiya */}
            <motion.button
              onClick={handleToggleFavorite}
              whileTap={{ scale: 0.8 }}
              className="ml-4 text-3xl relative"
            >
              <motion.span
                key={liked ? "liked" : "unliked"} // animate har safar ishlashi uchun
                initial={{ scale: 1 }}
                animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <AiFillHeart className={liked ? "text-red-500" : "text-gray-300"} />
              </motion.span>
            </motion.button>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* COLORS */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-900">Colors</h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color.toLowerCase() }}
                  className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? "ring-2 ring-pink-600" : "opacity-70"}`}
                />
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-900">Sizes</h3>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2 rounded-lg border-2 font-semibold transition
                    ${selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black hover:bg-black hover:text-white"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO CART BUTTON */}
          <motion.button
            onClick={handleAddToCart}
            disabled={adding}
            whileTap={{ scale: 0.95 }}
            className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold transition
              ${adding ? "bg-black text-white" : "bg-pink-600 text-white hover:bg-pink-700"}`}
          >
            {adding ? (
              <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2">
                ✅ Added to Cart
              </motion.span>
            ) : (
              <>Add to Cart 🛒</>
            )}
          </motion.button>
        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-pink-700 mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {similarProducts.map((sp) => (
              <motion.div
                key={sp.slug}
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push(`/categories/products/${sp.category}/${sp.slug}`)}
                className="bg-white p-4 rounded-3xl shadow cursor-pointer"
              >
                <img src={sp.images[0]} alt={sp.title} className="h-40 w-full object-contain mb-3" />
                <h3 className="font-semibold">{sp.title}</h3>
                <span className="text-pink-700 font-bold">{sp.discount ?? sp.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
