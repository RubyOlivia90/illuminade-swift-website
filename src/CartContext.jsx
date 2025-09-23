import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
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
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      const price = product.price != null ? parseFloat(product.price) : 0;
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1, price }];
      }
    });
  }, []);

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

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const calculateTotal = useCallback(() => {
    return cartItems
      .reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
      .toFixed(2);
  }, [cartItems]);

  const getItemQuantity = useCallback(
    (id) => cartItems.find((item) => item.id === id)?.quantity || 0,
    [cartItems]
  );

  const getTotalItems = useCallback(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

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

    // Here you can implement your backend call or Stripe logic
    alert('Checkout successful!');
    clearCart();
    navigate('/');
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
