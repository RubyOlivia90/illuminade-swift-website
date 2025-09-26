// inside CartContext.jsx

const handleCheckout = async (customerDetails) => {
  try {
    if (cartItems.length === 0) {
      console.error("No items in cart");
      return;
    }

    const firstItem = cartItems[0]; // since you’re selling single gallery pieces
    const successUrl = `${window.location.origin}/download?title=${encodeURIComponent(
      firstItem.title
    )}&imageUrl=${encodeURIComponent(firstItem.imageUrl)}`;
    const cancelUrl = `${window.location.origin}/checkout`;

    const response = await fetch(
      `${import.meta.env.VITE_STRAPI_API_URL}/api/orders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          customerDetails,
          successUrl,
          cancelUrl,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Stripe session creation failed");
    }

    // Redirect to Stripe Checkout
    const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    await stripe.redirectToCheckout({ sessionId: data.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
  }
};
