import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart as emptyCart,
} from "@/redux/slices/cartSlices";

export interface CartItem {
  id: string; // product._id
  name: string; // productName
  brand: string; // brandName
  price: number;
  quantity: number;
  image: string;
  // images?: string[]; // Optional: store all images
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (id: string, brand: string) => Promise<void>;
  updateQuantity: (
    id: string,
    brand: string,
    quantity: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Utility to manage session ID
const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

const API_BASE = "https://med-kit-lab-ces-be.onrender.com";

// === API FUNCTIONS ===
const fetchCart = async (sessionId: string) => {
  const res = await axios.get(`${API_BASE}/api/cart/${sessionId}`);
  return res.data.cart;
};

const addToCartAPI = async (
  sessionId: string,
  productId: string,
  brandName: string,
  quantity: number
) => {
  const res = await axios.post(`${API_BASE}/api/cart/${sessionId}/add`, {
    productId,
    brandName,
    quantity,
  });
  return res.data.cart;
};

const updateCartAPI = async (
  sessionId: string,
  productId: string,
  brandName: string,
  quantity: number
) => {
  const res = await axios.put(`${API_BASE}/api/cart/${sessionId}/update`, {
    productId,
    brandName,
    quantity,
  });
  return res.data.cart;
};

const removeFromCartAPI = async (
  sessionId: string,
  productId: string,
  brandName: string
) => {
  const res = await axios.delete(`${API_BASE}/api/cart/${sessionId}/remove`, {
    data: { productId, brandName },
  });
  return res.data.cart;
};

const clearCartAPI = async (sessionId: string) => {
  const res = await axios.delete(`${API_BASE}/api/cart/${sessionId}/clear`);
  return res.data.cart;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const sessionId = getOrCreateSessionId();

  const syncCart = (cart: any) => {
    const parsedItems = cart.items.map((item: any) => ({
      id: item.product._id,
      name: item.product.productName,
      brand: item.brandName,
      price: item.price,
      quantity: item.quantity,
      image: item.product.productImages?.[0],
      images: item.product.productImages,
    }));
    setCartItems(parsedItems);
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await fetchCart(sessionId);
        syncCart(cart);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    loadCart();
  }, [sessionId]);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    try {
      const cart = await addToCartAPI(sessionId, item.id, item.brand, 1);
      dispatch(addItemToCart({ ...item, quantity: 1 }));
      syncCart(cart);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const updateQuantity = async (
    id: string,
    brand: string,
    quantity: number
  ) => {
    try {
      const cart = await updateCartAPI(sessionId, id, brand, quantity);
      dispatch(updateItemQuantity({ id, quantity }));
      syncCart(cart);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const removeFromCart = async (id: string, brand: string) => {
    try {
      const cart = await removeFromCartAPI(sessionId, id, brand);
      dispatch(removeItemFromCart(id));
      syncCart(cart);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      const cart = await clearCartAPI(sessionId);
      dispatch(emptyCart());
      syncCart(cart);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
