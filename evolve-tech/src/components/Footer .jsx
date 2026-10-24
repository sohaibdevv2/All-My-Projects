import Link from 'next/link';
import React from 'react';
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

  return (
    <footer className="px-10 py-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0 font-semibold font-sans">
          <p>&copy; Copyright {currentYear}{' '} - Sohaibdevv</p>
        </div>
        <div className="flex items-center space-x-4 pb-5">
          <Link href="https://linkedin.com/in/sohaibmalikdev" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={27} className="hover:text-blue-500"/>
          </Link>
          <Link href="https://github.com/sohaibdevv" target="_blank" rel="noopener noreferrer">
            <FaGithub size={27} className="hover:text-blue-500" />
          </Link>
          <Link href="https://medium.com/@sohaibmalikdev" target="_blank" rel="noopener noreferrer">
          <FaMedium size={27} className="hover:text-blue-500" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
