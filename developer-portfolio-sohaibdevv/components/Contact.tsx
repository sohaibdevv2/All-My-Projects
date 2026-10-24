
import React, { useState } from 'react';
import SectionTitle from './ui/SectionTitle';
import { CONTACT_INFO } from '../constants';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const myForm = e.target as HTMLFormElement;
    const formData = new FormData(myForm);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString(),
    })
      .then(() => {
        setSubmitStatus({ message: 'Thank you! Your message has been sent.', type: 'success' });
        myForm.reset();
      })
      .catch((error) => {
        setSubmitStatus({ message: `Oops! There was an error: ${error.message}`, type: 'error' });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <section id="contact" className="py-20 bg-primary-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Get In Touch" title="Contact Me" />
        <div className="grid md:grid-cols-5 gap-12">
          <div className="md:col-span-2 flex flex-col gap-6">
            {CONTACT_INFO.map(info => (
               <a 
                key={info.name}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary-dark p-6 rounded-2xl text-center border border-transparent hover:bg-transparent hover:border-accent-blue transition-all duration-300"
               >
                <div className="text-accent-blue inline-block mb-2">
                    {info.icon}
                </div>
                <h4 className="text-lg font-semibold text-white">{info.name}</h4>
                <h5 className="text-gray-400 break-words">{info.value}</h5>
                <p className="text-accent-blue mt-2 text-sm">Send a message</p>
               </a>
            ))}
          </div>
          <form 
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleFormSubmit}
            className="md:col-span-3 flex flex-col gap-6"
          >
            {/* Netlify hidden inputs for form handling and spam prevention */}
            <input type="hidden" name="form-name" value="contact" />
            <div className="hidden">
              <label>
                Don’t fill this out if you’re human: <input name="bot-field" />
              </label>
            </div>

            <input 
              type="text" 
              name="name" 
              placeholder="Your Full Name" 
              required 
              disabled={isSubmitting}
              className="w-full p-4 rounded-lg bg-secondary-dark border border-gray-700 focus:border-accent-blue focus:outline-none text-white transition-colors disabled:opacity-50"
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Your Email" 
              required 
              disabled={isSubmitting}
              className="w-full p-4 rounded-lg bg-secondary-dark border border-gray-700 focus:border-accent-blue focus:outline-none text-white transition-colors disabled:opacity-50"
            />
            <textarea 
              name="message" 
              rows={7} 
              placeholder="Your Message" 
              required
              disabled={isSubmitting}
              className="w-full p-4 rounded-lg bg-secondary-dark border border-gray-700 focus:border-accent-blue focus:outline-none text-white transition-colors resize-none disabled:opacity-50"
            ></textarea>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold py-3 px-8 rounded-full hover:scale-105 transform transition-transform duration-300 self-start shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {submitStatus && (
              <p className={`mt-2 text-sm font-medium ${submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {submitStatus.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
