// import React from 'react';
import type { NavLink, SocialLink, Skill, Project } from './types';

// SVG Icons
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);


const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

export const NAV_LINKS: NavLink[] = [
  { id: 'home', title: 'Home' },
  { id: 'about', title: 'About' },
  { id: 'skills', title: 'Skills' },
  { id: 'projects', title: 'Projects' },
  { id: 'contact', title: 'Contact' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Github', icon: <GithubIcon />, url: 'https://github.com/sohaibdevv' },
  { name: 'LinkedIn', icon: <LinkedinIcon />, url: 'https://linkedin.com/sohaib-m-malik' },
  { name: 'Email', icon: <EmailIcon />, url: 'sohaibmalikccm@gmail.com' },
];

export const SKILLS: Skill[] = [
  { name: 'HTML', icon: <img src="https://img.icons8.com/color/48/000000/html-5--v1.png" alt="HTML" className="w-12 h-12"/> },
  { name: 'CSS', icon: <img src="https://img.icons8.com/color/48/000000/css3.png" alt="CSS" className="w-12 h-12"/> },
  { name: 'JavaScript', icon: <img src="https://img.icons8.com/color/48/000000/javascript--v1.png" alt="JavaScript" className="w-12 h-12"/> },
  { name: 'TypeScript', icon: <img src="https://img.icons8.com/color/48/000000/typescript.png" alt="TypeScript" className="w-12 h-12"/> },
  { name: 'React', icon: <img src="https://img.icons8.com/color/48/000000/react-native.png" alt="React" className="w-12 h-12"/> },
  { name: 'Next.js', icon: <img src="https://img.icons8.com/color/48/000000/nextjs.png" alt="Next.js" className="w-12 h-12" style={{filter: 'invert(1)'}}/> },
  // { name: 'Node.js', icon: <img src="https://img.icons8.com/color/48/000000/nodejs.png" alt="Node.js" className="w-12 h-12"/> },
  { name: 'Tailwind CSS', icon: <img src="https://img.icons8.com/color/48/000000/tailwindcss.png" alt="Tailwind CSS" className="w-12 h-12"/> },
  // { name: 'MongoDB', icon: <img src="https://img.icons8.com/color/48/000000/mongodb.png" alt="MongoDB" className="w-12 h-12"/> },
  // { name: 'PostgreSQL', icon: <img src="https://img.icons8.com/color/48/000000/postgreesql.png" alt="PostgreSQL" className="w-12 h-12"/> },
  { name: 'Docker', icon: <img src="https://img.icons8.com/color/48/000000/docker.png" alt="Docker" className="w-12 h-12"/> },
  { name: 'Git', icon: <img src="https://img.icons8.com/color/48/000000/git.png" alt="Git" className="w-12 h-12"/> },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce website with features like product catalog, shopping cart, user authentication, and a payment gateway integration.',
    image: 'https://picsum.photos/seed/project1/400/300',
    category: 'Web App',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A sleek and responsive task management application built with React and a Node.js backend, helping users to organize their daily tasks.',
    image: 'https://picsum.photos/seed/project2/400/300',
    category: 'Web App',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'A weather dashboard that provides real-time weather data for any city in the world using a third-party weather API.',
    image: 'https://picsum.photos/seed/project3/400/300',
    category: 'Web App',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
  },
  {
    id: 4,
    title: 'Personal Blog',
    description: 'A fully functional personal blog built with Next.js and Markdown for content. Features static site generation for optimal performance.',
    image: 'https://picsum.photos/seed/project4/400/300',
    category: 'Web App',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
  },
  {
    id: 5,
    title: 'Mobile Fitness Tracker',
    description: 'A cross-platform mobile app for tracking workouts and fitness goals, built with React Native and Firebase for the backend.',
    image: 'https://picsum.photos/seed/project5/400/300',
    category: 'Mobile App',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
  },
   {
    id: 6,
    title: 'AI Chatbot Assistant',
    description: 'An intelligent chatbot assistant integrated into a web app, using a Large Language Model to answer user queries in real-time.',
    image: 'https://picsum.photos/seed/project6/400/300',
    category: 'AI Project',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
  },
];

export const CONTACT_INFO = [
    {
        name: "Email",
        value: "sohaibmalikccm@gmail.com",
        icon: <EmailIcon />,
        link: "mailto:sohaibmalikccm@gmail.com"
    },
    {
        name: "WhatsApp",
        value: "+92 0000000000",
        icon: <PhoneIcon />,
        link: "https://wa.me/1234567890"
    }
]
