
import React from 'react';
import { NAV_LINKS, SOCIAL_LINKS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-dark py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <a href="#home" className="text-2xl font-bold text-white mb-8 inline-block">
          Sohaib<span className="text-accent-blue">.dev</span>
        </a>
        
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
          {NAV_LINKS.map(link => (
            <li key={link.id}>
              <a href={`#${link.id}`} className="hover:text-white transition-colors duration-300">
                {link.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex justify-center items-center gap-6 mb-8">
            {SOCIAL_LINKS.map(link => (
                <a 
                  key={link.name} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-primary-dark p-3 rounded-lg text-white hover:bg-gray-800 transition-colors duration-300"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
            ))}
        </div>

        <div className="border-t border-gray-700 pt-8">
            <small>&copy; Sohaib.dev. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
