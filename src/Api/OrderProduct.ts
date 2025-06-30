import axios from "axios";

const API_BASE_URL = "https://med-kit-lab-ces-be.onrender.com";

// Create Order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
