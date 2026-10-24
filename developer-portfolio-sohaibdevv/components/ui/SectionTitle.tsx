
import React from 'react';

interface SectionTitleProps {
  subtitle: string;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ subtitle, title }) => {
  return (
    <div className="text-center mb-12">
      <h3 className="text-lg font-medium text-accent-blue mb-2">{subtitle}</h3>
      <h2 className="text-4xl font-bold text-white">{title}</h2>
    </div>
  );
};

export default SectionTitle;
