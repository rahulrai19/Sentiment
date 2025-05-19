import React, { Suspense, lazy } from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import FeedbackForm from "./components/FeedbackForm";
import HeroSection from "./components/HeroSection";
import Login from "./components/Login";
import Footer from "./components/Footer";
import './index.css'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AuthProvider, useAuth } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load components
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const About = lazy(() => import("./components/About"));

// Simple navigation bar component
function NavBar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 py-5 mb-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <span className="text-white text-3xl font-extrabold tracking-tight drop-shadow-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="#2563eb"/>
              <path d="M8 13h8M8 17h5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="9" r="1.5" fill="white"/>
              <circle cx="15" cy="9" r="1.5" fill="white"/>
            </svg>
            Sentiment <span className="text-yellow-300 ml-1">Feeder</span>
          </span>
        </div>
        {/* Hamburger menu for mobile */}
        <button className="sm:hidden ml-2 text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <XMarkIcon className="h-8 w-8" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
        {/* Nav links */}
        <div className={`flex-col sm:flex-row flex sm:gap-6 gap-3 items-center absolute sm:static top-20 left-0 w-full sm:w-auto bg-gradient-to-b sm:bg-none from-blue-700/95 to-blue-500/95 sm:bg-transparent z-40 sm:flex transition-all duration-300 ${menuOpen ? 'flex' : 'hidden sm:flex'}`}>
          <Link
            to="/"
            className={`text-white px-4 py-2 rounded-lg hover:bg-blue-800/70 transition font-semibold ${location.pathname === "/" ? "bg-blue-900/80" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Feedback
          </Link>
          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className={`text-white px-4 py-2 rounded-lg hover:bg-blue-800/70 transition font-semibold ${location.pathname === "/admin" ? "bg-blue-900/80" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-white px-4 py-2 rounded-lg border border-white hover:bg-red-500/80 hover:text-white transition font-bold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`text-white px-4 py-2 rounded-lg border border-white hover:bg-yellow-400/80 hover:text-blue-900 transition font-bold ${location.pathname === "/login" ? "bg-yellow-300 text-blue-900" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
          <Link
            to="/about"
            className={`text-white px-4 py-2 rounded-lg hover:bg-blue-800/70 transition font-semibold ${location.pathname === "/about" ? "bg-blue-900/80" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <Toaster position="top-center" />
      <NavBar />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <FeedbackForm />
          </>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<div>Loading...</div>}>
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/submit" element={<FeedbackForm />} />
        <Route path="/about" element={
          <Suspense fallback={<div>Loading...</div>}>
            <About />
          </Suspense>
        } />
        <Route path="*" element={<div className="text-center mt-10 text-xl">404 - Page Not Found</div>} />
      </Routes>
      <Footer />
    </AuthProvider>
  </BrowserRouter>
)