# Iluminade Swift - The Frontend

### ✨ [Check out the live site!](https://illuminade-swift.onrender.com)

Hey! This is the frontend for Iluminade Swift, a full-stack photography e-commerce site. This React application handles everything the user sees and interacts with, from the homepage to the final checkout confirmation. It's built to be fast, responsive, and user-friendly.

This project was a huge learning experience, especially in connecting a React app to a headless CMS and handling the full deployment lifecycle.

---

## The Tech Stack 🥞

* **Framework:** React (with Hooks & Context API for cart management)
* **Build Tool:** Vite
* **Routing:** React Router
* **API Communication:** Axios
* **Deployment:** Render (as a Static Site)

---

## Features

* **Dynamic Pages:** The homepage and gallery content are fetched dynamically from a Strapi backend.
* **Shopping Cart:** A fully functional cart using React's Context API to manage state across the application.
* **Stripe Checkout:** Seamlessly redirects users to a secure Stripe-hosted checkout page.
* **Digital Downloads:** After a successful purchase, users are redirected to a page that automatically downloads their purchased digital image.
* **Responsive Design:** Styled with CSS for a great experience on both desktop and mobile.



---

## Lessons Learned

I faced many challenges on this as it was my first deployed full stack project; but the biggest hurdles were routing after deployment which was solved by using hashrouter instead of browserrouter, properly fetching data from strapi and creating a download page that stripe redirects to after purchase. Deployment was also a barrier as I learned about environment variables and database migration from SQLite. I learned so much about full stack development during this project and I am very grateful for the experience. I hope it serves my wonderful, talented wife Iluminade well!