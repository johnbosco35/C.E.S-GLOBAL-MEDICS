import React, { useState, useEffect } from "react";
import { Search, Eye, Loader } from "lucide-react";
import ProductDetailModal from "./ProductDetailModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion } from "framer-motion";
import {
  fetchProductsFailure,
  fetchProductsStart,
  fetchProductsSuccess,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
} from "@/redux/slices/productSlices";
import {
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/Api/AdminProduct";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

interface Brand {
  name: string;
  price: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  brands: Brand[];
  description?: string;
  images: string[];
}

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(fetchProductsStart());
      setLoading(true);
      setError(null);
      try {
        const res = await getAllProducts();
        console.log("📦 API Response:", res);

        const fetchedProducts = (res.products || []).map((product: any) => ({
          id: product._id,
          name: product.productName,
          category: product.category,
          brands: Array.isArray(product.brands) ? product.brands : [],
          description: product.description,
          images: product.productImages || [],
        }));
        setLoading(false);
        setProducts(fetchedProducts);
        dispatch(fetchProductsSuccess(fetchedProducts));
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Failed to fetch products");
        console.error("❌ Failed to fetch products:", err);
        dispatch(
          fetchProductsFailure(err.message || "Failed to fetch products")
        );
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm]);

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdateProduct = async (p: Product) => {
    try {
      const form = new FormData();
      form.append("name", p.name || "");
      form.append("category", p.category);
      form.append("description", p.description || "");
      form.append("brands", JSON.stringify(p.brands));
      p.images.forEach((img: any) => {
        if (img instanceof File) form.append("images", img);
      });
      const res = await updateProduct(p.id, form);
      dispatch(updateProductAction(p));
      setIsModalOpen(false);
    } catch (e) {
      console.error("Update failed:", e.response?.data || e.message);
      alert("Update failed. " + (e.response?.data?.message || e.message));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const deleteResult = await deleteProduct(productId);
    if (deleteResult.error) {
      console.error("❌ Failed to delete product:", deleteResult.error);
      return;
    }
    dispatch(deleteProductAction(productId));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          View Products
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div className="py-4 flex justify-center items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Loader className="animate-spin w-5 h-5" />
                    <span>Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-300"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => {
                const firstBrand = product.brands?.[0] || {
                  name: "",
                  price: "0",
                  stock: 0,
                };
                const price = firstBrand.price;
                const stock = firstBrand.stock;
                const status = stock > 0 ? "Active" : "Out of Stock";

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      ₦{Number(price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {stock}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <motion.button
                        onClick={() => handleViewProduct(product)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateProduct}
        onDelete={(id) => handleDeleteProduct(id)}
      />
    </div>
  );
};

export default AdminProducts;
