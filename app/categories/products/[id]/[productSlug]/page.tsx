// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { AiFillHeart } from "react-icons/ai";
// import { useCart } from "@/app/context/CartContext";
// import { useFavorite } from "@/app/context/FavoriteContext";

// type Product = {
//   id: number;
//   title: string;
//   category: string;
//   price?: string;
//   discount?: string;
//   images: string[];
//   description: string;
//   colors: string[];
//   sizes: string[];
//   material?: string;
//   weight?: string;
//   ageGroup?: string;
// };

// export default function ProductDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { addToCart } = useCart();
//   const { favorites, toggleFavorite } = useFavorite();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [selectedColor, setSelectedColor] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");
//   const [liked, setLiked] = useState(false);
//   const [adding, setAdding] = useState(false);

//   const productId = params.productSlug; // ID bo‘yicha olish
// console.log(productId);

//   // ================== FETCH PRODUCT BY ID ==================
//   useEffect(() => {
//     if (!productId) return;

//     fetch(`http://localhost:1337/api/products/${productId}?populate=*`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.data) {
//           const p = data.data.attributes;
//           const mapped: Product = {
//             id: data.data.id,
//             title: p.title,
//             category: p.category?.data?.attributes?.name || "Unknown",
//             price: p.price ? `$${p.price}` : undefined,
//             discount: p.discount_price ? `$${p.discount_price}` : undefined,
//             images:
//               p.image_1?.data?.map((img: any) => `http://localhost:1337${img.attributes.url}`) ||
//               ["/placeholder.png"],
//             description: p.description || "",
//             colors: p.colors?.data?.map((c: any) => c.attributes.name) || [],
//             sizes: p.sizes?.data?.map((s: any) => s.attributes.name) || [],
//             material: p.material || "",
//             weight: p.weight || "",
//             ageGroup:
//               p.ages?.data?.map((a: any) => a.attributes.name).join(", ") || "All",
//           };
//           setProduct(mapped);

//           // check favorite
//           const isFav = favorites.some((fav) => fav?.id === mapped.id);
//           setLiked(isFav);
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Fetch error:", err);
//         setLoading(false);
//       });
//   }, [productId, favorites]);

//   if (loading) return <div className="text-center mt-20">Loading...</div>;
//   if (!product) return <div className="text-center mt-20">Product not found</div>;

//   const handleAddToCart = () => {
//     if (!selectedColor || !selectedSize) {
//       alert("Please select a color and size!");
//       return;
//     }

//     addToCart({
//       title: product.title,
//       price: product.discount
//         ? Number(product.discount.replace("$", ""))
//         : Number(product.price?.replace("$", "") || 0),
//       color: selectedColor,
//       size: selectedSize,
//       quantity: 1,
//       image: product.images[0],
//     });

//     setAdding(true);
//     setTimeout(() => {
//       setAdding(false);
//       router.push("/products");
//     }, 1200);
//   };

//   const handleToggleFavorite = () => {
//     toggleFavorite(product);
//     setLiked(!liked);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-6 md:p-16">
//       <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
//         {/* IMAGE */}
//         <div className="bg-white rounded-3xl shadow-xl p-6">
//           <motion.img
//             key={product.images[activeImage]}
//             src={product.images[activeImage]}
//             alt={product.title}
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.3 }}
//             className="w-full h-[400px] md:h-[500px] object-contain rounded-2xl mb-4"
//           />
//           <div className="flex gap-3 justify-center">
//             {product.images.map((img, index) => (
//               <button
//                 key={index}
//                 onClick={() => setActiveImage(index)}
//                 className={`w-20 h-20 rounded-xl border overflow-hidden transition ${
//                   activeImage === index
//                     ? "border-pink-600 ring-2 ring-pink-400"
//                     : "border-gray-200 opacity-70 hover:opacity-100"
//                 }`}
//               >
//                 <img src={img} alt="thumb" className="w-full h-full object-contain" />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* INFO */}
//         <div>
//           <h1 className="text-4xl md:text-5xl font-bold text-pink-700 mb-2">{product.title}</h1>

//           <div className="flex gap-3 mb-4 items-center">
//             <span className="text-2xl font-extrabold text-pink-700">
//               {product.discount ?? product.price}
//             </span>
//             {product.discount && (
//               <span className="line-through text-gray-400">{product.price}</span>
//             )}

//             <motion.button
//               onClick={handleToggleFavorite}
//               whileTap={{ scale: 0.8 }}
//               className="ml-4 text-3xl"
//             >
//               <AiFillHeart className={liked ? "text-red-500" : "text-gray-300"} />
//             </motion.button>
//           </div>

//           <p className="text-gray-700 mb-6">{product.description}</p>

//           {/* COLORS */}
//           <div className="mb-6">
//             <h3 className="font-semibold mb-2 text-gray-900">Colors</h3>
//             <div className="flex gap-3">
//               {product.colors.map((color) => (
//                 <button
//                   key={color}
//                   onClick={() => setSelectedColor(color)}
//                   style={{ backgroundColor: color.toLowerCase() }}
//                   className={`w-10 h-10 rounded-full border-2 ${
//                     selectedColor === color ? "ring-2 ring-pink-600" : "opacity-70"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* SIZES */}
//           <div className="mb-6">
//             <h3 className="font-semibold mb-2 text-gray-900">Sizes</h3>
//             <div className="flex gap-3 flex-wrap">
//               {product.sizes.map((size) => (
//                 <button
//                   key={size}
//                   onClick={() => setSelectedSize(size)}
//                   className={`px-5 py-2 rounded-lg border-2 font-semibold transition ${
//                     selectedSize === size
//                       ? "bg-black text-white border-black"
//                       : "bg-white text-black border-black hover:bg-black hover:text-white"
//                   }`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <motion.button
//             onClick={handleAddToCart}
//             disabled={adding}
//             whileTap={{ scale: 0.95 }}
//             className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold transition ${
//               adding ? "bg-black text-white" : "bg-pink-600 text-white hover:bg-pink-700"
//             }`}
//           >
//             {adding ? <>✅ Added to Cart</> : <>Add to Cart 🛒</>}
//           </motion.button>
//         </div>
//       </div>
//     </div>
//   );
// }