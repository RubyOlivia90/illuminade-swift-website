import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RersQBTFrZCx0w8b8RSt0aguVIJt71xwSkVLfsEZiI2xUadPACzOcE7mfkVDciY4ubAfXqMF79Htontosr2scqD00uhaqfe1Q'; 
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

  // Effect to save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  // --- Cart Management Functions ---
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
        // Ensure productToAdd has a price property, defaulting if missing
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

  // --- Stripe Checkout Handler ---
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some items before checking out."); 
      return;
    }

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js failed to load. Check your publishable key and network.");
      }

      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd', 
          product_data: {
            name: item.title,
            description: item.description,
            images: item.imageUrl && item.imageUrl.startsWith('http') && !item.imageUrl.includes('No+Product+Image') ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(parseFloat(item.price) * 100), 
        },
        quantity: item.quantity,
      }));

      const { error } = await stripe.redirectToCheckout({
          lineItems: lineItems,
          mode: 'payment', 
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cancel`,
      });

      if (error) {
          console.error("Stripe redirect error:", error);
          alert(`Checkout failed: ${error.message || 'An unknown error occurred.'}`);
      }

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
