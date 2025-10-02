# Iluminade Swift - The Backend (Strapi CMS)

Hey there! This is the backend for the Iluminade Swift project, a full-stack photography e-commerce site. This Strapi application serves as a powerful headless CMS, managing all the content, product data, and API integrations.

---

## What This Backend Does

This isn't a traditional website backend. It's a **headless CMS**, which means its only job is to provide data as a JSON API. The React frontend consumes this API to build the pages the user sees. This separation makes the whole system more flexible and scalable.

This backend handles:
* Content for the homepage and gallery.
* Product information for the photos, including titles, descriptions, and prices.
* Integration with third-party services like Cloudinary and Stripe.

---

## The Tech Stack ⚙️

* **Framework:** Strapi (built on Node.js and Koa)
* **Database:** PostgreSQL
* **Media Hosting:** Cloudinary via the official Strapi provider.
* **Payments:** Stripe API for creating secure checkout sessions.
* **Deployment:** Render (as a Web Service)

---

## Core Features & Integrations

* **Content Management:** Provides a user-friendly admin panel to add/edit/delete photos, update page text, and set prices.
* **Cloudinary Integration:** When an image is uploaded to the Strapi Media Library, it's automatically sent to Cloudinary for optimized storage and delivery. Strapi just saves the Cloudinary URL.
* **Stripe Integration:** A custom controller at `/api/stripe/create-checkout-session` receives cart data from the frontend, formats it for the Stripe API (including converting the price to cents), and creates a secure checkout session, returning the session ID to the client.
* **Flattened API Response:** The API is configured to provide a "flattened" JSON response, making it easier for the frontend to consume the data without needing to parse through nested `attributes` objects.

---

## Lessons Learned

This is a tough section to fill out. Going into this I had no API experience and didn't know how to use a cms, so the learning curve was super steep for me. I learned how to configure Strapi, make a headless cms website, connect external services (SendMail, Cloudinary, Stripe), address CORS issues for fetching data, built controllers and routes for my integrated services, database management/sending database info from SQLite to a Postgre service on render, and most importantly the entire deployment process which was quite difficult. 

