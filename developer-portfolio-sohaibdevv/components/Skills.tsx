
import React from 'react';
import { SKILLS } from '../constants';
import SectionTitle from './ui/SectionTitle';
import type { Skill } from '../types';

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => (
  <article className="flex items-center gap-4 bg-secondary-dark p-4 rounded-lg border border-gray-700 hover:border-accent-blue transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/10">
    <div>{skill.icon}</div>
    <div className="text-left">
      <h4 className="text-md font-semibold text-white">{skill.name}</h4>
    </div>
  </article>
);

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-primary-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="What Skills I Have" title="My Skills" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {SKILLS.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
