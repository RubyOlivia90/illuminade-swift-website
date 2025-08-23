// src/CartContext.jsx
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Define your Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RhxDHI1Z4BL7SCtbuFgB8YLJq08QNSeWkGVsYqJh0TyUn24LJ6mAJB83aIPqi8iVIr2sYEzxI507awSc4PYtSA500v0wMQv6E';
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

  const handleCheckout = async (customerDetails) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some items before proceeding.");
      return;
    }

    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address || !customerDetails.city || !customerDetails.state || !customerDetails.zip) {
      alert("Please fill in all customer details before proceeding.");
      return;
    }

    const orderDetails = cartItems.map(item => 
      `${item.title} (x${item.quantity}) - $${(parseFloat(item.price) * item.quantity).toFixed(2)}`
    ).join('\n');
  
    const emailBody = `New Order from Illuminade Website!

  Customer Information:
  Name: ${customerDetails.name}
  Email: ${customerDetails.email}
  Phone: ${customerDetails.phone}
  Address: ${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state}, ${customerDetails.zip}

  Order Details:
  ${orderDetails}

  Total: $${calculateTotal()}

  Please contact the customer to confirm the order and arrange payment.`;

    try {
      const backendUrl = 'http://localhost:1337/api/email/send'; 

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: customerDetails.name,
          email: 'iluminadeswiftproton.me@proton.me', 
          message: emailBody,
        }),
      });

      if (response.ok) {
        alert("Your order has been sent to the site owner. They will contact you shortly to complete the purchase!");
        clearCart(); 
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send order email.');
      }
    } catch (e) {
      console.error("Error sending order email:", e);
      alert(`Order submission failed: ${e.message || 'Please try again.'}`);
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