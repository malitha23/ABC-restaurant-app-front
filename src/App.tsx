import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import HotDessert from './components/HotDessert/HotDessert';
import Banner from './components/Banner/Banner';
import PopularRecipe from './components/PopularRecipe/PopularRecipe';
import Testimonial from './components/Testimonial/Testimonial';
import Footer from './components/Footer/Footer.tsx';
import Login from './components/screens/Loginpage.tsx'; // Import the Login component
import Register from './components/screens/RegisterPage.tsx'; // Import the Register component
import AdminDashboard from './components/screens/Admin/AdminDashboard';
import UserDashboard from './components/screens/Admin/UserDashboard.tsx';
import StaffDashboard from './components/screens/Admin/StaffDashboard.tsx';
import About from './components/screens/navbarPages/About';
import Menu from './components/screens/navbarPages/Menu';
import Delivery from './components/screens/navbarPages/Delivery';
import Contact from './components/screens/navbarPages/Contact';
import { CartProvider  } from './components/context/CartContext.tsx';
import Cart from './components/screens/Cart/Cart.tsx';

const HomePage = () => {
  return (
    <div className='overflow-x-hidden bg-white2 text-dark'>
      <div className="relative overflow-hidden">
        <Navbar />
        <Hero />
      </div>
      <HotDessert />
      <Banner />
      <PopularRecipe />
      <Testimonial />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <CartProvider >
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        {/* Additional routes can be defined here */}
      </Routes>
    </Router>
    </CartProvider >
  );
}

export default App;
