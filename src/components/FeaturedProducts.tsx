import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { getFeaturedProducts } from "@/Api/UserProduct";

interface FeaturedProduct {
  _id: string;
  productName: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  productImages: string[];
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedProducts(8);
        console.log("Fetched featured products:", res);
        setProducts(res.products || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            Top-rated medical supplies trusted by professionals
          </p>
        </div>
        {/* 
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : ( */}
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="relative">
                  <img
                    src={product.productImages[0]}
                    alt={product.productName}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.originalPrice > product.price && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Save ₦{product.originalPrice - product.price}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    {product.category}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {product.productName}
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

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        ₦{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₦{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/product/${product._id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-block bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </>
        {/* )} */}
      </div>
    </section>
  );
};

export default FeaturedProducts;
