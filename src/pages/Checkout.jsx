// After
import React from 'react';
import { useCart } from '../CartContext'; 

export default function Checkout() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, calculateTotal, handleCheckout } = useCart();

  return (
    <div className="checkout-page-container">
      <h1 className="checkout-title">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="checkout-empty-message">Your cart is empty!</p>
      ) : (
        <>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="item-image" />
                  )}
                  <div className="item-info">
                    <h2 className="item-title">{item.title}</h2>
                    <p className="item-price">${parseFloat(item.price).toFixed(2)} each</p>
                  </div>
                </div>
                <div className="item-quantity-controls">
                  <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  <button onClick={() => removeFromCart(item.id)} className="remove-item-button">Remove</button>
                </div>
                <div className="item-subtotal">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p className="cart-total">Total: ${calculateTotal()}</p>
            <div className="cart-actions">
              <button onClick={clearCart} className="clear-cart-button">Clear Cart</button>
              <button onClick={handleCheckout} className="proceed-to-checkout-button">Proceed to Checkout</button>
            </div>
          </div>
        </>
      )}

      {/* Internal CSS for the Checkout component */}
      <style>
        {`
          .checkout-page-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            padding-top: 8rem; /* To clear fixed navbar */
            font-family: 'Helvetica Neue', sans-serif;
            color: #f0f0f0;
          }

          .checkout-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.5rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2rem;
            color: #f0f0f0;
          }

          .checkout-empty-message {
            text-align: center;
            font-size: 1.2rem;
            color: #a5a5a5;
          }

          .cart-items-list {
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            margin-bottom: 2rem;
          }

          .cart-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 0;
            border-bottom: 1px solid #e0e0e0;
          }

          .cart-item:last-child {
            border-bottom: none;
          }

          .item-details {
            display: flex;
            align-items: center;
            flex-grow: 1;
          }

          .item-image {
            width: 80px;
            height: 80px;
            object-fit: contain;
            border-radius: 5px;
            margin-right: 1rem;
            background-color: #f9f9f9;
          }

          .item-info {
            flex-grow: 1;
          }

          .item-title {
            font-size: 1.1rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 0.25rem;
          }

          .item-price {
            font-size: 0.9rem;
            color: #555;
          }

          .item-quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-right: 1rem;
          }

          .item-quantity-controls button {
            background-color: #a8e6cf;
            color: #064420;
            border: none;
            border-radius: 5px;
            padding: 0.3rem 0.6rem;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s ease;
          }

          .item-quantity-controls button:hover:not(:disabled) {
            background-color: #82c9a8;
          }

          .item-quantity-controls button:disabled {
            background-color: #e0e0e0;
            cursor: not-allowed;
          }

          .item-quantity {
            font-size: 1rem;
            color: #333;
            min-width: 25px;
            text-align: center;
          }

          .remove-item-button {
            background-color: #ffcccc !important; /* Lighter red */
            color: #cc0000 !important; /* Darker red */
            margin-left: 0.5rem;
          }

          .remove-item-button:hover {
            background-color: #ffb3b3 !important;
          }

          .item-subtotal {
            font-size: 1.1rem;
            font-weight: bold;
            color: #333;
            min-width: 80px;
            text-align: right;
          }

          .cart-summary {
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            text-align: right;
          }

          .cart-total {
            font-size: 1.5rem;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 1.5rem;
          }

          .cart-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
          }

          .cart-actions button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
            font-size: 1.1rem;
          }

          .clear-cart-button {
            background-color: #f0f0f0;
            color: #4b5563;
          }

          .clear-cart-button:hover {
            background-color: #e0e0e0;
            transform: translateY(-2px);
          }

          .proceed-to-checkout-button {
            background-color: #a8e6cf;
            color: #064420;
          }

          .proceed-to-checkout-button:hover {
            background-color: #82c9a8;
            transform: translateY(-2px);
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .checkout-page-container {
              padding: 1rem;
              padding-top: 6rem;
            }
            .checkout-title {
              font-size: 2rem;
            }
            .cart-item {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.5rem;
            }
            .item-quantity-controls {
              width: 100%;
              justify-content: center;
              margin-right: 0;
            }
            .item-subtotal {
              width: 100%;
              text-align: center;
              margin-top: 0.5rem;
            }
            .cart-actions {
              flex-direction: column;
              align-items: stretch;
            }
            .cart-actions button {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}