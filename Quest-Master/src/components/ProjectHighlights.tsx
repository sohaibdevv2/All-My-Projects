'use client';

import { motion } from 'framer-motion';
import { useNarrativeStore } from '@/store/narrativeStore';

export function ProjectHighlights() {
  const { getUnlockedProjects } = useNarrativeStore();
  const projects = getUnlockedProjects();

  if (projects.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <motion.h2
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
      >
        🚀 Portfolio Highlights
        <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
          ({projects.length})
        </span>
      </motion.h2>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 10 }}
            className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 rounded-lg p-5 border-l-4 border-emerald-500 dark:border-emerald-400 shadow-md cursor-pointer transition"
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="text-3xl flex-shrink-0"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
              >
                {project.icon}
              </motion.div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>

                <p className="text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map((tech) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-block bg-emerald-200 dark:bg-emerald-700 text-emerald-900 dark:text-emerald-100 text-xs px-3 py-1 rounded-full font-semibold"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Impact */}
                {project.impact && (
                  <motion.p
                    className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    📈 {project.impact}
                  </motion.p>
                )}

                {/* Unlock date */}
                {project.unlockedAt && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    🔓 Unlocked {new Date(project.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600 grid grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {projects.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Projects Created</p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {projects.reduce((sum, p) => sum + p.technologies.length, 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Technologies Used</p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {projects.filter((p) => p.impact).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Major Impacts</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
