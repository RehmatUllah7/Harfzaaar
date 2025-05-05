import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-extrabold mb-4 text-white">About HarfZaar</h2>
          <p className="text-sm leading-relaxed text-gray-300">
          Harfzaar connects poets, readers, and dreamers, offering a vibrant space
            to explore timeless words and new creations. Dive into the world of poetry!
          
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-2xl font-extrabold mb-4 text-white">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <a href="/poets" className="text-gray-300 hover:text-white transition-all duration-200">Poetry Collections</a>
            </li>
            <li>
              <a href="/poets" className="text-gray-300 hover:text-white transition-all duration-200">Poet Biographies</a>
            </li>
            <li>
              <a href="/qaafia" className="text-gray-300 hover:text-white transition-all duration-200">Find Exact Qaafia</a>
            </li>
            <li>
              <a href="/bazm" className="text-gray-300 hover:text-white transition-all duration-200">Engage in Chat</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-extrabold mb-4 text-white">Contact Us</h2>
          <p className="text-sm text-gray-300 mb-2">
            Email: 
            <a href="mailto:rehmatullah7427@gmail.com" className="hover:underline ml-1">harfzaar360@gmail.com</a>
          </p>
          <p className="text-sm text-gray-300">Phone: (051) 8855130</p>
        </div>

        {/* Social Media Links */}
        <div>
          <h2 className="text-2xl font-extrabold mb-4 text-white">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/profile.php?id=100073299455714" target="_blank" rel="noopener noreferrer" 
              className="flex items-center justify-center w-10 h-10 border-2 border-gray-500 rounded-full hover:border-purple-500 hover:bg-purple-500 transition-all duration-300">
              <FaFacebookF size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
              className="flex items-center justify-center w-10 h-10 border-2 border-gray-500 rounded-full hover:border-purple-500 hover:bg-purple-500 transition-all duration-300">
              <FaTwitter size={18} />
            </a>
            <a href="https://www.instagram.com/rehmat.ullah17/" target="_blank" rel="noopener noreferrer" 
              className="flex items-center justify-center w-10 h-10 border-2 border-gray-500 rounded-full hover:border-purple-500 hover:bg-purple-500 transition-all duration-300">
              <FaInstagram size={18} />
            </a>
            <a href="https://www.linkedin.com/in/muhammad-athar-ehsan-527892222/" target="_blank" rel="noopener noreferrer" 
              className="flex items-center justify-center w-10 h-10 border-2 border-gray-500 rounded-full hover:border-purple-500 hover:bg-purple-500 transition-all duration-300">
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-400 text-sm mt-8 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} <span className="font-semibold text-white">Harfzaar</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;