import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-8 px-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          {/* Replace with your actual social media links */}
          <a href="https://github.com/Void-Walker01" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition">
            <FaGithub size={24} />
          </a>
          <a href="https://www.linkedin.com/in/rohit--guleria/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition">
            <FaLinkedin size={24} />
          </a>
          <a href="https://www.instagram.com/ro_guleria?igsh=MXR4bHJhbDU3cnc5Ng==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition">
            <FaInstagram size={24} />
          </a>
        </div>
        <p className="text-gray-500">
          &copy; {year} CampusHive. Made with ❤️ by Rohit Guleria.
        </p>
      </div>
    </footer>
  );
}

export default Footer;