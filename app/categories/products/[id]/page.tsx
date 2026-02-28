"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiFillHeart } from "react-icons/ai";
import { useCart } from "@/app/context/CartContext";
import { useFavorite } from "@/app/context/FavoriteContext";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  images: string[];
  color: string[];
  sizes: string[];
  ages?: string[];
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorite();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:1337/api/products/${id}?populate=*`
        );
        const json = await res.json();
        const data = json?.data || json;

        if (!data) {
          setLoading(false);
          return;
        }

        const attr = data.attributes || data;

        // 🔹 IMAGES
        const images: string[] = [];
        ["image_1", "image_2", "image_3", "image_4", "image_5"].forEach((key) => {
          if (attr[key]?.length) {
            attr[key].forEach((img: any) => {
              if (img?.url) images.push(`http://localhost:1337${img.url}`);
            });
          }
        });

        // 🔹 COLORS, SIZES, AGES
        const color: string[] = Array.from(new Set(attr.color || []));
        const sizes: string[] = Array.from(new Set(attr.sizes || []));
        const ages: string[] = Array.from(new Set(attr.ages || []));

        const formattedProduct: Product = {
          id: data.id,
          title: attr.title,
          description: attr.description,
          price: attr.price,
          discount_price: attr.discount_price,
          images: images.length ? images : ["/placeholder.png"],
          color: color.length ? color : ["N/A"],
          sizes: sizes.length ? sizes : ["N/A"],
          ages: ages.length ? ages : ["N/A"],
        };

        setProduct(formattedProduct);
        setLiked(favorites.some((f) => f.id === data.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, favorites]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize || !selectedAge) {
      alert("Please select a color, size and age!");
      return;
    }

    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.discount_price ?? product.price,
      color: selectedColor,
      size: selectedSize,
      age: selectedAge,
      quantity: 1,
      image: product.images[0],
    });

    setAdding(true);
    setTimeout(() => {
      setAdding(false);
      router.push("/products");
    }, 1000);
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product);
    setLiked((prev) => !prev);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!product) return <div className="text-center mt-20">Product not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-6 md:p-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* IMAGE */}
        <div className="bg-white rounded-3xl shadow-xl p-6 relative">
          {product.discount_price && (
            <span className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              SALE
            </span>
          )}
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
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-xl border overflow-hidden transition
                  ${activeImage === i
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
              ${product.discount_price ?? product.price}
            </span>
            {product.discount_price && (
              <span className="line-through text-gray-400">${product.price}</span>
            )}
            <motion.button
              onClick={handleToggleFavorite}
              whileTap={{ scale: 0.8 }}
              className="ml-4 text-3xl relative"
            >
              <AiFillHeart className={liked ? "text-red-500" : "text-gray-300"} />
            </motion.button>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* COLORS */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-900">Colors</h3>
            <div className="flex gap-3">
              {product.color.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c !== "N/A" ? c.toLowerCase() : "gray" }}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === c ? "ring-2 ring-pink-600" : "opacity-70"
                  }`}
                  disabled={c === "N/A"}
                />
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-900">Sizes</h3>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.length > 0 ? (
                product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-5 py-2 rounded-lg border-2 font-semibold transition
                      ${selectedSize === s
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black hover:bg-black hover:text-white"
                      }`}
                  >
                    {s}
                  </button>
                ))
              ) : (
                <span className="text-gray-400">No sizes available</span>
              )}
            </div>
          </div>

          {/* AGES */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-900">Age</h3>
            <div className="flex gap-3 flex-wrap">
              {product.ages.map((a) => (
                <button
                  key={a}
                  onClick={() => setSelectedAge(a)}
                  className={`px-4 py-2 rounded-lg border-2 font-semibold transition
                    ${selectedAge === a
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black hover:bg-black hover:text-white"
                    }`}
                  disabled={a === "N/A"}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO CART */}
          <motion.button
            onClick={handleAddToCart}
            disabled={adding}
            whileTap={{ scale: 0.95 }}
            className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold transition
              ${adding ? "bg-black text-white" : "bg-pink-600 text-white hover:bg-pink-700"}`}
          >
            {adding ? "✅ Added to Cart" : "Add to Cart 🛒"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}