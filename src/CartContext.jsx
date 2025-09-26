// src/CartContext.jsx
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Add item to cart
  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev; // avoid duplicates
      return [...prev, item];
    });
  };

  // ✅ Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Clear cart after checkout or manually
  const clearCart = () => {
    setCartItems([]);
  };

  // ✅ Calculate total
  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);

  // ✅ Stripe checkout
  const handleCheckout = async (customerDetails) => {
    if (!cartItems.length) {
      alert("Cart is empty!");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_STRAPI_API_URL}/api/orders`,
        { cartItems, customerDetails },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.url) {
        window.location.href = response.data.url; // redirect to Stripe
      } else {
        console.error("No Stripe URL returned:", response.data);
        alert("Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error("Error creating Stripe session:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        calculateTotal,
        handleCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ✅ Custom hook
export function useCart() {
  return useContext(CartContext);
}
