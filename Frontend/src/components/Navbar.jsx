import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("token");
  const isLandingPage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out successfully");
    navigate("/");
  };

  const creatorStyle = {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic'
  };

  return (
    <nav className={`fixed w-full z-50 ${isLandingPage ? 'bg-transparent' : 'bg-indigo-600'} text-white p-4`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-bold text-2xl">TalentHunt</Link>
            <span style={creatorStyle}>Made by Sumeet Pathak</span>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="hover:text-indigo-200 transition-colors">Login</Link>
                <Link to="/signup" className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/student-dashboard" className="hover:text-indigo-200 transition-colors">Dashboard</Link>
                <Link to="/mentor-dashboard" className="hover:text-indigo-200 transition-colors">Mentorship</Link>
                {localStorage.getItem("role") === "admin" && (
                  <Link to="/admin-dashboard" className="hover:text-indigo-200 transition-colors">Admin</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} mt-4`}>
          {!isLoggedIn ? (
            <div className="flex flex-col space-y-4">
              <Link to="/login" className="hover:text-indigo-200 transition-colors">Login</Link>
              <Link to="/signup" className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors text-center">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Link to="/student-dashboard" className="hover:text-indigo-200 transition-colors">Dashboard</Link>
              <Link to="/mentor-dashboard" className="hover:text-indigo-200 transition-colors">Mentorship</Link>
              {localStorage.getItem("role") === "admin" && (
                <Link to="/admin-dashboard" className="hover:text-indigo-200 transition-colors">Admin</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors w-full"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
