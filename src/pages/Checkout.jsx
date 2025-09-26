import React, { useState, useEffect } from "react";
import { useCart } from "../CartContext";

export default function Checkout() {
  const { cartItems, handleCheckout, clearCart, calculateTotal } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log("Cart items at checkout:", cartItems);
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zip) newErrors.zip = "ZIP code is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await handleCheckout(formData);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Checkout failed. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: 50, color: "#f5f5f5" }}>
        <h2>Thank you for your order!</h2>
        <p>We’ll send confirmation to {formData.email}</p>
      </div>
    );
  }

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2 style={{ color: '#f5f5f5' }}>Checkout</h2>

      {/* Cart Summary */}
      <div style={{ ...styles.cartSummary, background: '#333' }}>
        <h3 style={{ color: '#f5f5f5' }}>Cart Items ({cartItems.length})</h3>
        {cartItems.length === 0 ? (
          <p style={{ color: '#ccc' }}>Your cart is empty</p>
        ) : (
          <>
            {cartItems.map((item, idx) => (
              <div key={idx} style={styles.cartItem}>
                <span style={{ color: '#f5f5f5' }}>{item.title}</span>
                <span style={{ color: '#f5f5f5' }}>${Number(item.price).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, fontWeight: 'bold', color: '#f5f5f5' }}>
              Total: ${calculateTotal()}
            </div>
            <button
              type="button"
              onClick={clearCart}
              style={{
                marginTop: 10,
                padding: "8px 12px",
                borderRadius: 4,
                border: "none",
                background: "#ff6b6b",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Clear Cart
            </button>
          </>
        )}
      </div>

      {/* Checkout Form */}
      {["name", "email", "phone", "address", "city", "state", "zip"].map((field) => (
        <div key={field} style={styles.fieldWrapper}>
          <label style={{ ...styles.label, color: '#f5f5f5' }}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type={field === "email" ? "email" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            style={{
              ...styles.input,
              borderColor: errors[field] ? "red" : "#444",
              background: '#222',
              color: '#f5f5f5'
            }}
            required
          />
          {errors[field] && <span style={styles.error}>{errors[field]}</span>}
        </div>
      ))}

      <button type="submit" style={styles.button} disabled={isSubmitting || cartItems.length === 0}>
        {isSubmitting ? "Submitting..." : "Place Order"}
      </button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: 500,
    margin: "0 auto",
    padding: 20,
    border: "1px solid #444",
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
    background: '#1a1a1a',
  },
  cartSummary: {
    marginBottom: 20,
    padding: 10,
    border: "1px solid #444",
    borderRadius: 4,
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
    borderBottom: "1px solid #444",
  },
  fieldWrapper: {
    marginBottom: 15,
  },
  label: {
    display: "block",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 16,
    background: '#222',
    color: '#f5f5f5',
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 4,
    border: "none",
    background: "#a8e6cf",
    color: "#1a1a1a",
    fontSize: 16,
    cursor: "pointer",
  },
};