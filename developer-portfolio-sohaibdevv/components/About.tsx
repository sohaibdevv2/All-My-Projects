
import React from 'react';
import AboutImage from './assets/about.png';
import SectionTitle from './ui/SectionTitle';

const About: React.FC = () => {
  const stats = [
    { value: '+', label: 'Years Experience' },
    { value: '+', label: 'Completed Projects' },
    { value: '+', label: 'Companies Worked' },
  ];

  return (
    <section id="about" className="py-20 bg-secondary-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Get To Know" title="About Me" />
        <div className="grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2 w-full h-80 rounded-3xl bg-gradient-to-tr from-accent-blue to-accent-purple p-1">
             <img 
                src={AboutImage} 
                alt="About me"
                className="w-full h-full object-cover rounded-3xl"
             />
          </div>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-center">
              {stats.map(stat => (
                <div key={stat.label} className="bg-primary-dark p-6 rounded-2xl border border-gray-700 hover:bg-gray-800 transition-all duration-300">
                  <h4 className="text-xl font-bold text-white">{stat.value}</h4>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Sohaib Malik | Based in Karachi, Pakistan
            </p>
            <a 
              href="#contact"
              className="bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold py-3 px-8 rounded-full hover:scale-105 transform transition-transform duration-300 inline-block shadow-lg"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
