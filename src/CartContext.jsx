import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RhxDHI1Z4BL7SCtbuFgB8YLJq08QNSeWkGVsYqJh0TyUn24LJ6mAJB83aIPqi8iVIr2sYEzxI507awSc4PYtSA500v0wMQv6E';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('cartItems', JSON.stringify(cartItems)); } catch {}
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1, price: product.price ?? '0.00' }];
    });
  }, []);

  const updateQuantity = useCallback((id, change) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + change) } : i).filter(i => i.quantity > 0));
  }, []);

  const removeFromCart = useCallback((id) => setCartItems(prev => prev.filter(i => i.id !== id)), []);
  const clearCart = useCallback(() => setCartItems([]), []);
  const calculateTotal = useCallback(() => cartItems.reduce((t, i) => t + parseFloat(i.price) * i.quantity, 0).toFixed(2), [cartItems]);

  const handleCheckout = async (customer) => {
    if (!cartItems.length) return alert("Cart is empty!");
    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city || !customer.state || !customer.zip)
      return alert("Fill all details!");

    const orderDetails = cartItems.map(i => `${i.title} (x${i.quantity}) - $${(parseFloat(i.price) * i.quantity).toFixed(2)}`).join('\n');
    const emailBody = `Customer: ${customer.name}\nEmail: ${customer.email}\nOrder:\n${orderDetails}\nTotal: $${calculateTotal()}`;

    try {
      const backendUrl = `${import.meta.env.VITE_STRAPI_API_URL}/api/email/send`;
      const response = await fetch(backendUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: customer.name, email: 'iluminadeswiftproton.me@proton.me', message: emailBody }) });
      if (response.ok) { alert("Order sent!"); clearCart(); } else throw new Error("Failed to send order email.");
    } catch (e) { alert(`Order failed: ${e.message}`); }
  };

  return <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, calculateTotal, handleCheckout }}>{children}</CartContext.Provider>;
};
