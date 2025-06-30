import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { motion } from "framer-motion";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();
  const { theme } = useTheme();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 1500 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
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
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {getTotalItems()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center mb-6">
          <Link
            to="/products"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              Your cart is empty
            </p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.brand}`}
                  className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  {/* <div className="grid grid-cols-3 gap-1 w-24">
                    {item.images?.slice(0, 3).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${item.name} ${i + 1}`}
                        className="w-full h-16 object-cover rounded-md"
                      />
                    ))}
                  </div> */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {item.brand}
                    </p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 ml-4">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          updateQuantity(item.id, item.brand, item.quantity - 1)
                        }
                        className="px-2 py-1 text-gray-700 dark:text-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="px-3 py-1 text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          updateQuantity(item.id, item.brand, item.quantity + 1)
                        }
                        className="px-2 py-1 text-gray-700 dark:text-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.id, item.brand)}
                      className="text-red-600 dark:text-red-400 hover:underline text-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="font-semibold dark:text-white">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping
                  </span>
                  <span className="font-semibold dark:text-white">
                    ₦{shipping.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tax (8%)
                  </span>
                  <span className="font-semibold dark:text-white">
                    ₦{tax.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t pt-3 mt-3 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block bg-blue-600 text-white py-3 rounded-md text-center font-semibold hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </Link>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                Secure checkout powered by CES Medics
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
