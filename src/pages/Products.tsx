import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Grid, List, Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const Products = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    {
      id: 1,
      name: "Digital Stethoscope Pro",
      brand: "MedTech",
      price: 299999.0,
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      category: "Medical Equipment",
      inStock: true,
    },
    {
      id: 2,
      name: "Blood Glucose Test Kit",
      brand: "LabCare",
      price: 89999.0,
      rating: 4.9,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      category: "Laboratory Kits",
      inStock: true,
    },
    {
      id: 3,
      name: "PCR Reagent Set",
      brand: "BioSolutions",
      price: 159999.0,
      rating: 4.7,
      reviews: 56,
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
      category: "Reagents",
      inStock: false,
    },
    {
      id: 4,
      name: "Disposable Syringes (100pk)",
      brand: "SafeMed",
      price: 24999.0,
      rating: 4.6,
      reviews: 203,
      image:
        "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=300&fit=crop",
      category: "Disposables",
      inStock: true,
    },
    {
      id: 5,
      name: "Blood Pressure Monitor",
      brand: "HealthTech",
      price: 199999.0,
      rating: 4.5,
      reviews: 78,
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
      category: "Medical Equipment",
      inStock: true,
    },
    {
      id: 6,
      name: "Pipette Tips (1000pk)",
      brand: "LabSupply",
      price: 34999.0,
      rating: 4.4,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
      category: "Disposables",
      inStock: true,
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              C.E.S GLOBAL MEDICS
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="text-gray-600 hover:text-blue-600">
                <ShoppingCart className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Medical Products
            </h1>
            <p className="text-gray-600">
              Browse our complete catalog of medical supplies
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </motion.select>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div
                className={`relative ${
                  viewMode === "list" ? "w-48 flex-shrink-0" : ""
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={`object-cover ${
                    viewMode === "list" ? "w-full h-full" : "w-full h-48"
                  }`}
                />
                {!product.inStock && (
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
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <Link
                    to={`/product/${product.id}`}
                    className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors ${
                      !product.inStock ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
