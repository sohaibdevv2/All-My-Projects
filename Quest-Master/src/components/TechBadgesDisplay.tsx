'use client';

import { motion } from 'framer-motion';
import { useNarrativeStore } from '@/store/narrativeStore';

export function TechBadgesDisplay() {
  const { getUnlockedBadges, allBadges } = useNarrativeStore();
  const unlockedBadges = getUnlockedBadges();

  if (allBadges.length === 0) {
    return null;
  }

  // Group badges by category
  const categories = ['frontend', 'backend', 'devops', 'database', 'tools', 'methodology'] as const;
  const badgesByCategory = categories.map((cat) => ({
    category: cat,
    badges: unlockedBadges.filter((b) => b.category === cat),
  }));

  const categoryLabels: Record<string, string> = {
    frontend: '🎨 Frontend',
    backend: '⚙️ Backend',
    devops: '☁️ DevOps',
    database: '🗄️ Database',
    tools: '🛠️ Tools',
    methodology: '📋 Methodology',
  };

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <motion.h2
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
      >
        ⭐ Tech Stack Badges
        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
          ({unlockedBadges.length})
        </span>
      </motion.h2>

      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        {badgesByCategory.map(({ category, badges }) =>
          badges.length > 0 ? (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {categoryLabels[category]}
              </h3>

              <motion.div className="flex flex-wrap gap-3" variants={containerVariants}>
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="relative group"
                  >
                    <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg p-3 shadow-md hover:shadow-lg transition cursor-pointer">
                      <div className="text-3xl mb-1">{badge.icon}</div>
                      <div className="text-xs font-bold text-white text-center">{badge.name}</div>
                    </div>

                    {/* Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      whileHover={{ opacity: 1, y: -10 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded pointer-events-none whitespace-nowrap z-10"
                    >
                      {badge.description}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                    </motion.div>

                    {/* Unlock indicator */}
                    {badge.unlockedAt && (
                      <motion.div
                        className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : null
        )}
      </motion.div>

      {/* All Available Badges Info */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 Keep exploring your career path to unlock more technologies!
          {unlockedBadges.length < allBadges.length && (
            <span> ({allBadges.length - unlockedBadges.length} more available)</span>
          )}
        </p>
      </motion.div>
    </motion.div>
  );
}
