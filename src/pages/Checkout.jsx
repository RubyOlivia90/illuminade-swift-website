import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../CartContext";

export default function Checkout() {
  const { cartItems, handleCheckout, clearCart } = useContext(CartContext);

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
    console.log(`Field changed: ${name} = ${value}`);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zip) newErrors.zip = "ZIP code is required";

    console.log("Validation errors:", newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("Form submission prevented due to errors");
      return;
    }

    setIsSubmitting(true);
    try {
      await handleCheckout(formData);
      console.log("Order submitted successfully!");
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting order:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.confirmation}>
        <h2>Thank you for your order!</h2>
        <p>We’ll send confirmation to {formData.email}</p>
      </div>
    );
  }

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <div style={styles.cartSummary}>
        <h3>Cart Items</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item, idx) => (
            <div key={idx} style={styles.cartItem}>
              <span>{item.title}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))
        )}
        <button type="button" onClick={clearCart} style={{...styles.button, marginTop: '1rem', background: 'gray'}}>Clear Cart</button>
      </div>

      {["name", "email", "phone", "address", "city", "state", "zip"].map((field) => (
        <div key={field} style={styles.fieldWrapper}>
          <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            type={field === "email" ? "email" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            style={{
              ...styles.input,
              borderColor: errors[field] ? "red" : "#ccc",
            }}
            required
          />
          {errors[field] && <span style={styles.error}>{errors[field]}</span>}
        </div>
      ))}

      <button type="submit" style={styles.button} disabled={isSubmitting}>
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
    border: "1px solid #ddd",
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
  },
  cartSummary: {
    marginBottom: 20,
    padding: 10,
    border: "1px solid #eee",
    borderRadius: 4,
    background: "#fafafa",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
    borderBottom: "1px solid #eee",
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
    background: "#0070f3",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },
  confirmation: {
    textAlign: "center",
    padding: 50,
  },
};