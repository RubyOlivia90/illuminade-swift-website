import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Store from './pages/Store';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      {/* Add padding-top to the main content area to prevent it from going under the fixed navbar */}
      {/* 5rem is a good starting point, adjust if your navbar is taller/shorter */}
      <main style={{ paddingTop: '5rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/store" element={<Store />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;