'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function SkillsPanel() {
  const { getUnlockedSkills, getLockedSkills, addSkillExperience, unlockSkill } =
    useGameStore();

  const unlockedSkills = getUnlockedSkills();
  const lockedSkills = getLockedSkills();

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
    <div className="space-y-6">
      {/* Unlocked Skills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Unlocked Skills
        </h3>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {unlockedSkills.map((skill) => {
            const experiencePercentage =
              (skill.experience / skill.experienceToNextLevel) * 100;

            return (
              <motion.div
                key={skill.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg p-4 border-2 border-green-300 dark:border-green-700 shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {skill.icon} {skill.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {skill.description}
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold ml-2"
                  >
                    {skill.level}
                  </motion.div>
                </div>

                {/* Level Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Level Progress</span>
                    <span>
                      {skill.experience} / {skill.experienceToNextLevel}
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${experiencePercentage}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-green-500 h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Max Level Info */}
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Level {skill.level} / {skill.maxLevel}
                </div>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addSkillExperience(skill.id, 20)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-2 rounded transition"
                  >
                    +20 XP
                  </motion.button>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Locked Skills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Locked Skills
        </h3>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {lockedSkills.map((skill) => (
            <motion.div
              key={skill.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border-2 border-gray-400 dark:border-gray-600 shadow-md opacity-75"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    {skill.icon} {skill.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.description}
                  </p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gray-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold ml-2"
                >
                  🔒
                </motion.div>
              </div>

              {/* Prerequisites */}
              {skill.prerequisites.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">
                    Prerequisites:
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {skill.prerequisites.map((prereq) => (
                      <li key={prereq}>• Unlock {prereq}</li>
                    ))}
                  </ul>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => unlockSkill(skill.id)}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white text-sm py-1 px-2 rounded transition"
              >
                Unlock
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
