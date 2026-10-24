
import React from 'react';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="bg-secondary-dark rounded-2xl overflow-hidden border border-gray-700 hover:border-accent-purple/50 transition-all duration-300 flex flex-col shadow-lg">
      <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-grow">{project.description}</p>
        <div className="mt-auto flex items-center gap-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:text-white border border-accent-blue py-2 px-4 rounded-lg transition-colors duration-300 text-sm font-medium"
          >
            GitHub
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent-blue text-white hover:bg-accent-purple py-2 px-4 rounded-lg transition-colors duration-300 text-sm font-medium"
          >
            Live Demo
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
