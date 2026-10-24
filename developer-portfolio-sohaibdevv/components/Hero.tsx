import React from "react";
import Sohaib from "./assets/sohaib.png";
import { SOCIAL_LINKS } from "../constants";

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center bg-primary-dark"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <span className="text-accent-blue font-semibold">Hello, I'm</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-2 mb-4">
              Sohaib Malik
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-300 mb-6">
              Full Stack Developer
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto md:mx-0">
              Based in Karachi Pakistan.
            </p>
            <div className="flex justify-center md:justify-start items-center gap-4 mb-8">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent-blue transition-colors duration-300"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            <div className="flex justify-center md:justify-start">
              <a
                href="#contact"
                className="bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold py-3 px-8 rounded-full hover:scale-105 transform transition-transform duration-300 shadow-lg"
              >
                Contact Me
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full blur-2xl opacity-50"></div>
            <img
              src={Sohaib}
              alt="Sohaib Malik"
              className="relative w-full h-full object-cover rounded-full border-4 border-secondary-dark shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
