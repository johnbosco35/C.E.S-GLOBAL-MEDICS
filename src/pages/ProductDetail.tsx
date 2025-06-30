import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { motion } from "framer-motion";
import { getProductById } from "@/Api/UserProduct";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, getTotalItems } = useCart();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        console.log("Fetched product:", data?.product);
        setProduct(data?.product);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedBrand) {
      alert("Please select a brand first");
      return;
    }

    const selectedBrandData = product.brands.find(
      (b: any) => b.name === selectedBrand
    );
    if (!selectedBrandData) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.productName,
        brand: selectedBrand,
        price: selectedBrandData.price,
        image: product.productImages?.[selectedImage] || "",
      });
    }

    alert(
      `Added ${quantity} ${product.productName} (${selectedBrand}) to cart!`
    );
  };

  if (!product) return null;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              C.E.S GLOBAL MEDICS
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                to="/cart"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {getTotalItems()}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/products"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <img
              src={product.productImages?.[selectedImage]}
              alt={product.productName}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
            <div className="flex space-x-2 overflow-x-auto">
              {product.productImages?.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`Product ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.productName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                {product.category}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Select Brand
              </h3>
              <div className="space-y-3">
                {product.brands?.map((brand: any) => (
                  <label
                    key={brand.name}
                    className="flex items-center justify-between p-3 border dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand.name}
                        checked={selectedBrand === brand.name}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium dark:text-white">
                          {brand.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          ({brand.stock} in stock)
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ₦{brand.price.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Quantity
              </h3>
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Minus className="w-4 h-4 dark:text-white" />
                </motion.button>
                <span className="px-4 py-2 border dark:border-gray-600 rounded-md text-center min-w-[60px] dark:text-white">
                  {quantity}
                </span>
                <motion.button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4 dark:text-white" />
                </motion.button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Product Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
