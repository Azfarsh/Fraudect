import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-start">
        {/* Contact Section */}
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <h5 className="text-lg font-bold text-white mb-2">Contact Us</h5>
          <p className="mb-4">For support or inquiries, feel free to reach out via email.</p>
          <p>
            <a href="mailto:fraudectsupport@example.com" className="text-gray-300 hover:text-white transition duration-300">
              fraudectsupport@example.com
            </a>
          </p>
        </div>

        {/* About Section */}
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <h5 className="text-lg font-bold text-white mb-2">About Fraudect</h5>
          <ul className="list-none space-y-1">
            <li><Link to="/about" className="hover:text-white transition duration-300">Who We Are</Link></li>
            <li><Link to="/mission" className="hover:text-white transition duration-300">Our Mission</Link></li>
          </ul>
        </div>

        {/* Resources Section */}
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <h5 className="text-lg font-bold text-white mb-2">Resources</h5>
          <ul className="list-none space-y-1">
            <li><Link to="/faqs" className="hover:text-white transition duration-300">FAQs</Link></li>
            <li><Link to="/support" className="hover:text-white transition duration-300">Support</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Fraudect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
