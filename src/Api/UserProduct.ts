import axios from "axios";

const API_BASE_URL = import.meta.env.DEV
  ? "/api" // use Vite proxy in dev
  : "https://med-kit-lab-ces-be.onrender.com/api"; // use full URL in prod

// Get all user products
export const getAllUserProduct = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/products`);
    
    // Validate response structure
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    
    // Ensure products array exists
    const products = response.data.products || response.data || [];
    
    // Transform products to include required fields
    const transformedProducts = products.map((product: any) => ({
      _id: product._id,
      productName: product.productName,
      category: product.category,
      brands: product.brands || [],
      productImages: product.productImages || [],
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      isFeatured: product.isFeatured || false,
    }));
    
    return {
      products: transformedProducts,
      total: transformedProducts.length,
      success: true,
    };
  } catch (error: any) {
    console.error("Error fetching user products:", error);
    
    // Return fallback data structure
    return {
      products: [],
      total: 0,
      success: false,
      error: error?.response?.data?.message || error?.message || "Failed to fetch products",
    };
  }
};

// Get product by ID
export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/products/${id}`);
    
    // Validate response structure
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    
    const product = response.data.product || response.data;
    
    // Transform product to include required fields
    const transformedProduct = {
      _id: product._id,
      productName: product.productName,
      category: product.category,
      brands: product.brands || [],
      productImages: product.productImages || [],
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      description: product.description || "",
      isFeatured: product.isFeatured || false,
    };
    
    return {
      product: transformedProduct,
      success: true,
    };
  } catch (error: any) {
    console.error(`Error fetching product with ID ${id}:`, error);
    
    // Return fallback data structure
    return {
      product: null,
      success: false,
      error: error?.response?.data?.message || error?.message || "Failed to fetch product",
    };
  }
};

// Get products by category
export const getProductsByCategory = async (
  category: string,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/products/category/${category}`,
      { params: { page, limit } }
    );
    
    // Validate response structure
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    
    // Ensure products array exists
    const products = response.data.products || response.data || [];
    
    // Transform products to include required fields
    const transformedProducts = products.map((product: any) => ({
      _id: product._id,
      productName: product.productName,
      category: product.category,
      brands: product.brands || [],
      productImages: product.productImages || [],
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      isFeatured: product.isFeatured || false,
    }));
    
    return {
      products: transformedProducts,
      total: transformedProducts.length,
      success: true,
      page,
      limit,
    };
  } catch (error: any) {
    console.error(`Error fetching products for category ${category}:`, error);
    
    // Return fallback data structure
    return {
      products: [],
      total: 0,
      success: false,
      error: error?.response?.data?.message || error?.message || "Failed to fetch category products",
    };
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/products/featured`, {
      params: { limit },
    });

    // Validate response structure
    if (!response.data) {
      throw new Error("Invalid response from server");
    }

    // Ensure products array exists
    const products = response.data.products || response.data || [];

    // Transform products to include required fields
    const transformedProducts = products.map((product: any) => ({
      _id: product._id,
      productName: product.productName,
      category: product.category,
      brand: product.brands?.[0]?.name || product.brand || "Unknown Brand",
      price: product.brands?.[0]?.price || product.price || 0,
      originalPrice:
        product.brands?.[0]?.originalPrice ||
        product.originalPrice ||
        product.price ||
        0,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      productImages: product.productImages || [],
      stock: product.brands?.[0]?.stock || product.stock || 0,
      isFeatured: product.isFeatured || false,
    }));

    return {
      products: transformedProducts,
      total: transformedProducts.length,
      success: true,
    };
  } catch (error: any) {
    console.error("Error fetching featured products:", error);

    // Return fallback data structure
    return {
      products: [],
      total: 0,
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch featured products",
    };
  }
};

// Search products
export const searchProducts = async (query: string, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/products/search`, {
      params: { q: query, page, limit },
    });
    
    // Validate response structure
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    
    // Ensure products array exists
    const products = response.data.products || response.data || [];
    
    // Transform products to include required fields
    const transformedProducts = products.map((product: any) => ({
      _id: product._id,
      productName: product.productName,
      category: product.category,
      brands: product.brands || [],
      productImages: product.productImages || [],
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      isFeatured: product.isFeatured || false,
    }));
    
    return {
      products: transformedProducts,
      total: transformedProducts.length,
      success: true,
      query,
      page,
      limit,
    };
  } catch (error: any) {
    console.error(`Error searching products with query "${query}":`, error);
    
    // Return fallback data structure
    return {
      products: [],
      total: 0,
      success: false,
      error: error?.response?.data?.message || error?.message || "Failed to search products",
    };
  }
};
