'use client';

import { motion } from 'framer-motion';
import { useNarrativeStore } from '@/store/narrativeStore';

export function AccomplishmentsDisplay() {
  const { getUnlockedAccomplishments } = useNarrativeStore();
  const accomplishments = getUnlockedAccomplishments();

  if (accomplishments.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <motion.h2
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
      >
        🏆 Career Accomplishments
        <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
          ({accomplishments.length})
        </span>
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {accomplishments.map((accomplishment) => (
          <motion.div
            key={accomplishment.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-4 border-2 border-purple-300 dark:border-purple-600 shadow-md cursor-pointer transition"
          >
            <motion.div
              className="text-4xl mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {accomplishment.icon}
            </motion.div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {accomplishment.title}
            </h3>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {accomplishment.description}
            </p>

            {accomplishment.unlockedAt && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                🔓 Unlocked {new Date(accomplishment.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
