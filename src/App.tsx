import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import HotDessert from './components/HotDessert/HotDessert';
import Banner from './components/Banner/Banner';
import PopularRecipe from './components/PopularRecipe/PopularRecipe';
import Testimonial from './components/Testimonial/Testimonial';
import Footer from './components/Footer/Footer';
import Login from './components/screens/Loginpage';
import Register from './components/screens/RegisterPage';
import AdminDashboard from './components/screens/Admin/AdminDashboard';
import UserDashboard from './components/screens/Admin/UserDashboard';
import StaffDashboard from './components/screens/Admin/StaffDashboard';
import About from './components/screens/navbarPages/About';
import Menu from './components/screens/navbarPages/Menu';
import Delivery from './components/screens/navbarPages/Delivery';
import Contact from './components/screens/navbarPages/Contact';
import { CartProvider } from './components/context/CartContext';
import Cart from './components/screens/Cart/Cart';
import Checkout from './components/screens/Checkout'; // Import Checkout component
import { useLocation } from 'react-router-dom';
import ReservationForm from './components/screens/Reservation/ReservationForm';

const HomePage = () => {
  return (
    <div className="overflow-x-hidden bg-white2 text-dark">
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

// Checkout page component that accesses the state
const CheckoutPage = () => {
  const location = useLocation();
  const { user, cartItems } = location.state || {}; // Extracting user and cartItems from location.state

  return <Checkout user={user} cartItems={cartItems} />;
};

const App = () => {

  const isAuthenticated = () => {
    // Replace this with your actual authentication logic
    return !!localStorage.getItem("userToken"); // Example using a token in local storage
  };

  return (
    <CartProvider>
      <Router>
      <Routes>
      {/* If the user is authenticated, navigate to AdminLayout */}
      {isAuthenticated() ? (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/checkout" element={<CheckoutPage /> } />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/reservation" element={<ReservationForm />} />
      </>
        
      ) : (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
        </>
      )}
    </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
