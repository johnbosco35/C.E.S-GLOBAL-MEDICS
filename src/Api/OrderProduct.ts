import axios from "axios";

const API_BASE_URL = "https://med-kit-lab-ces-be.onrender.com/api/orders";

export interface GetAllOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const getAllOrders = async (params: GetAllOrdersParams = {}) => {
  try {
    const { page = 1, limit = 10, status } = params;
    const query = new URLSearchParams();
    query.append("page", String(page));
    query.append("limit", String(limit));
    if (status) query.append("status", status);
    const response = await axios.get(`${API_BASE_URL}/?${query.toString()}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Failed to fetch orders");
    }
    throw new Error("Failed to fetch orders");
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${orderId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Failed to fetch order");
    }
    throw new Error("Failed to fetch order");
  }
};
