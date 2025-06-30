import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Grid, List, Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { getAllUserProduct, getProductsByCategory } from "@/Api/UserProduct";

interface Brand {
  brandName: string;
  price: number;
  countInStock: number;
}

interface Product {
  _id: string;
  productName: string;
  category: string;
  brands: Brand[];
  productImages: string[];
  rating?: number;
  reviews?: number;
}

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let res;
        if (category) {
          res = await getProductsByCategory(category);
        } else {
          res = await getAllUserProduct();
        }
        setProducts(res.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = products
    .filter((p) =>
      [p.productName, p.category].some((field) =>
        (field ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aPrice = a.brands[0]?.price ?? 0;
      const bPrice = b.brands[0]?.price ?? 0;

      switch (sortBy) {
        case "price-low":
          return aPrice - bPrice;
        case "price-high":
          return bPrice - aPrice;
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        default:
          return a.productName.localeCompare(b.productName);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              C.E.S GLOBAL MEDICS
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-blue-600">
              <ShoppingCart className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {category ? category.replace(/-/g, " ") : "Medical Products"}
            </h1>
            <p className="text-gray-600">
              {category
                ? `Browsing products in category: ${category}`
                : "Browse our complete catalog of medical supplies"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </motion.select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-lg">
            No products found matching your search.
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((product) => {
              const firstBrand = product.brands[0];
              const image = product.productImages[0];

              return (
                <div
                  key={product._id}
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      viewMode === "list" ? "w-48 flex-shrink-0" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={product.productName}
                      className={`object-cover ${
                        viewMode === "list" ? "w-full h-full" : "w-full h-48"
                      }`}
                    />
                    {firstBrand?.countInStock === 0 && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="text-sm text-gray-500 mb-1">
                      {product.category}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {firstBrand?.brandName}
                    </p>

                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating ?? 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.reviews ?? 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        ₦{(firstBrand?.price ?? 0).toLocaleString()}
                      </span>
                      <Link
                        to={`/product/${product._id}`}
                        className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors ${
                          firstBrand?.countInStock === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
