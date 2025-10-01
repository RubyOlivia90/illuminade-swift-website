// src/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const CartContext = createContext();

// Load Stripe.js with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };
  
  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    setCartItems((prev) => {
      const updatedItems = prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      // Filter out items with quantity <= 0
      return updatedItems.filter((item) => item.quantity > 0);
    });
  };

  // Clear cart after checkout or manually
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price of items in cart
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
      .toFixed(2);
  };
  
  // Get total count of items in cart
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Implement checkout with Stripe
  const handleCheckout = async (formData) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const stripe = await stripePromise;
      
      const item = cartItems[0];
      const successUrl = `${window.location.origin}/download?imageUrl=${encodeURIComponent(item.imageUrl)}&title=${encodeURIComponent(item.title)}`;

      // THIS IS THE FIX: The URL now matches your backend route exactly.
      const response = await axios.post(`${import.meta.env.VITE_STRAPI_API_URL}/api/stripe/create-checkout-session`, {
        cartItems: cartItems,
        successUrl,
      });

      if (response.data.stripeSession.id) {
        await stripe.redirectToCheckout({
          sessionId: response.data.stripeSession.id,
        });
        clearCart();
      } else {
        console.error("Stripe session ID not found in response.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal,
        handleCheckout,
        getTotalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for consuming the cart context
export function useCart() {
  return useContext(CartContext);
}