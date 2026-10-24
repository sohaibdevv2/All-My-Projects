
import React from 'react';

export interface NavLink {
  id: string;
  title: string;
}

export interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
}

export interface Skill {
  name: string;
  icon: React.ReactNode;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  githubUrl: string;
  liveUrl: string;
}
