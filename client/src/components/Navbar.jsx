import React, { useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Courses', href: '#' },
  { name: 'Instructors', href: '#' },
  { name: 'Testimonial', href: '#' },
  { name: 'Blog', href: '#' },
  { name: 'Contact', href: '#' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <a href="#" className="flex-shrink-0 flex items-center">
            <span className="bg-yellow-400 text-gray-900 font-bold p-1 rounded-full text-xl leading-none">
              e
            </span>
            <span className="text-2xl font-bold ml-2">learning</span>
          </a>

          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Phone size={18} className="text-yellow-400" />
            <span className="text-sm font-medium">1 800 222 000</span>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>

        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gray-900 shadow-lg py-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-4 pb-3 px-4">
            <div className="flex items-center space-x-2 text-base font-medium">
              <Phone size={18} className="text-yellow-400" />
              <span>1 800 222 000</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};