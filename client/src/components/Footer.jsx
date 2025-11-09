import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-16 border-t border-gray-300">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          
          {/* About */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">SkillifyMe</h2>
            <p className="text-gray-600 max-w-xs">
              Learn modern web development, AI/ML, programming, and more from beginner to advanced levels with hands-on projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="hover:text-yellow-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-yellow-500 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-yellow-500 transition-colors">Courses</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-yellow-500 transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-500 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
            <p className="text-gray-600">Phone: 1 800 222 000</p>
            <p className="text-gray-600">Email: support@elearning.com</p>
            <p className="text-gray-600">Address: 123 Learning St, Knowledge City</p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t border-gray-300 pt-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} eLearning. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
