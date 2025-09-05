// src/CartContext.jsx
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key
const STRIPE_PUBLISHABLE_KEY =
  'pk_live_51RhxDHI1Z4BL7SCtbuFgB8YLJq08QNSeWkGVsYqJh0TyUn24LJ6mAJB83aIPqi8iVIr2sYEzxI507awSc4PYtSA500v0wMQv6E';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist cart in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  // Add product to cart
  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const price = parseFloat(product.price || 0);
        return [...prev, { ...product, quantity: 1, price }];
      }
    });
  }, []);

  // Update quantity
  const updateQuantity = useCallback((id, change) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  // Remove item
  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => setCartItems([]), []);

  // Total price
  const calculateTotal = useCallback(() => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  }, [cartItems]);

  // Quantity of a single item
  const getItemQuantity = useCallback(
    (id) => cartItems.find((item) => item.id === id)?.quantity || 0,
    [cartItems]
  );

  // Total items in cart
  const getTotalItems = useCallback(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  // Checkout: sends order email
  const handleCheckout = async (customerDetails) => {
    if (!cartItems.length) {
      alert('Cart is empty!');
      return;
    }

    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zip'];
    for (let field of requiredFields) {
      if (!customerDetails?.[field]) {
        alert(`Please fill in ${field}`);
        return;
      }
    }

    const orderDetails = cartItems
      .map(
        (item) =>
          `${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
      )
      .join('\n');

    const emailBody = `
New Order from Website

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
          email: 'iluminadeswiftproton.me@proton.me',
          message: emailBody
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to send order.');
      }

      alert('Order sent! Site owner will contact you.');
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      alert(`Checkout failed: ${err.message}`);
    }
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calculateTotal,
    getItemQuantity,
    getTotalItems,
    handleCheckout
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
