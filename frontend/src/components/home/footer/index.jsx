import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 text-center sm:text-left">
        {/* About Section */}
        <div className="space-y-3 border-b sm:border-none pb-6 sm:pb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">About HarfZaad</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            Harfzaad connects poets, readers, and dreamers, offering a vibrant space
            to explore timeless words and new creations. Dive into the world of poetry!
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 border-b sm:border-none pb-6 sm:pb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/poets" className="text-gray-300 hover:text-white transition">
                Poetry Collections
              </a>
            </li>
            <li>
              <a href="/poets" className="text-gray-300 hover:text-white transition">
                Poet Biographies
              </a>
            </li>
            <li>
              <a href="/qaafia" className="text-gray-300 hover:text-white transition">
                Find Exact Qaafia
              </a>
            </li>
            <li>
              <a href="/bazm" className="text-gray-300 hover:text-white transition">
                Engage in Chat
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 border-b sm:border-none pb-6 sm:pb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Us</h2>
          <p className="text-sm text-gray-300">
            Email:
            <a
              href="mailto:harfzaar360@gmail.com"
              className="ml-1 hover:underline text-gray-200"
            >
              harfzaar360@gmail.com
            </a>
          </p>
          <p className="text-sm text-gray-300">Phone: (051) 8855130</p>
        </div>

        {/* Social Media */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Follow Us</h2>
          <div className="flex justify-center sm:justify-start flex-wrap gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=100073299455714"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:bg-purple-500 hover:border-purple-500 transition"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:bg-purple-500 hover:border-purple-500 transition"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://www.instagram.com/rehmat.ullah17/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:bg-purple-500 hover:border-purple-500 transition"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-athar-ehsan-527892222/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:bg-purple-500 hover:border-purple-500 transition"
            >
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-10 pt-6 border-t border-gray-700 text-center text-xs sm:text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="font-semibold text-white">Harfzaad</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
