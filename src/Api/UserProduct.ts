import axios from "axios";

const API_BASE_URL = "https://med-kit-lab-ces-be.onrender.com";

// Get all user products
export const getAllUserProduct = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user products:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/user/products/category/${category}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/user/products/featured`,
      {
        params: { limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

// Search products
export const searchProducts = async (query, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/user/products/search`,
      {
        params: {
          q: query,
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    throw error;
  }
};
