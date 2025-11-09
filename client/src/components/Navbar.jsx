import React, { useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Courses", href: "/courses" },
  { name: "Testimonial", href: "/testimonial" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white text-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="bg-yellow-400 text-gray-900 font-bold p-1 rounded-full text-xl leading-none">
              e
            </span>
            <span className="text-2xl font-bold ml-2">Learning</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Login/Register */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded hover:bg-yellow-300 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 border border-yellow-400 text-yellow-400 font-semibold rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg py-4 border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3 px-4">
            
            <div className="flex flex-col space-y-2">
              <Link
                to="/login"
                className="w-full px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded text-center hover:bg-yellow-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full px-4 py-2 border border-yellow-400 text-yellow-400 font-semibold rounded text-center hover:bg-yellow-400 hover:text-gray-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
