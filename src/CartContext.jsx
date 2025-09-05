// src/CartContext.jsx
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RhxDHI1Z4BL7SCtbuFgB8YLJq08QNSeWkGVsYqJh0TyUn24LJ6mAJB83aIPqi8iVIr2sYEzxI507awSc4PYtSA500v0wMQv6E';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Cart Context
export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Failed to parse cart from localStorage:', err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const price = product.price ? parseFloat(product.price).toFixed(2) : '0.00';
        return [...prev, { ...product, quantity: 1, price }];
      }
    });
  }, []);

  const updateQuantity = useCallback((productId, change) => {
    setCartItems(prev => prev
      .map(item => item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item)
      .filter(item => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const calculateTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  }, [cartItems]);

  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Checkout: sends order via Strapi email endpoint
  const handleCheckout = async (customerDetails) => {
    if (!cartItems.length) return alert('Cart is empty!');
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zip'];
    for (let field of requiredFields) {
      if (!customerDetails[field]) return alert('Please fill all customer details.');
    }

    const orderDetails = cartItems
      .map(item => `${item.title} (x${item.quantity}) - $${(parseFloat(item.price) * item.quantity).toFixed(2)}`)
      .join('\n');

    const emailBody = `
New Order from Website!

Customer:
Name: ${customerDetails.name}
Email: ${customerDetails.email}
Phone: ${customerDetails.phone}
Address: ${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state}, ${customerDetails.zip}

Order:
${orderDetails}

Total: $${calculateTotal()}
`;

    try {
      const backendUrl = `${import.meta.env.VITE_STRAPI_API_URL}/api/email/send`;
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerDetails.name,
          email: 'iluminadeswiftproton.me@proton.me', // site owner
          message: emailBody,
        }),
      });
      if (response.ok) {
        alert('Order sent! You will be contacted shortly.');
        clearCart();
      } else {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to send order email.');
      }
    } catch (err) {
      console.error('Error sending order:', err);
      alert(`Checkout failed: ${err.message || 'Try again.'}`);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        calculateTotal,
        getItemQuantity,
        getTotalItems,
        handleCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
