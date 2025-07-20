import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Define your Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RhxDPIDsQ9cJjG5L7qvEPejIpP1FAfpTUNO4wMMxr9YFj6l1N2vCiv02GW7r1AYk8zEC9wXGvaZHwb1qGqHiaXT00gJ7NiwYg';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Create the Context
export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = useCallback((productToAdd) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const price = productToAdd.price !== undefined && productToAdd.price !== null
                      ? parseFloat(productToAdd.price).toFixed(2)
                      : '0.00';
        return [...prevItems, { ...productToAdd, quantity: 1, price: price }];
      }
    });
  }, []);

  const updateQuantity = useCallback((productId, change) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  }, [cartItems]);

  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some items before checking out.");
      return;
    }

    try {
      // Ensure this URL matches your Strapi backend's create-checkout-session endpoint
      const backendUrl = 'http://localhost:1337/api/stripe/create-checkout-session';

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems: cartItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session on backend.');
      }

      const { url } = await response.json();
      window.location.href = url;

    } catch (e) {
      console.error("Error during checkout:", e);
      alert(`Checkout process failed: ${e.message || 'Please try again.'}`);
    }
  };

  const cartContextValue = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calculateTotal,
    getItemQuantity,
    getTotalItems,
    handleCheckout,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};