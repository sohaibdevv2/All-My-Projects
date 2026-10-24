'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function PlayerProgressCard() {
  const { progress, addExperience, levelUp } = useGameStore();
  const experiencePercentage = (progress.experience / progress.experienceToNextLevel) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 text-white shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Player Progress</h2>

      <div className="space-y-4">
        {/* Level Display */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-lg font-semibold">Level</span>
          <motion.span
            key={progress.level}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold"
          >
            {progress.level}
          </motion.span>
        </motion.div>

        {/* Experience Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span>Experience</span>
            <span>
              {progress.experience} / {progress.experienceToNextLevel}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${experiencePercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-yellow-400 h-full rounded-full"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <p className="text-sm text-gray-200">Total Playtime</p>
            <p className="font-semibold">
              {Math.floor(progress.totalPlayTime / 60)}m
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-200">Last Session</p>
            <p className="font-semibold">
              {new Date(progress.lastSessionDate).toLocaleDateString()}
            </p>
          </div>
        </motion.div>

        {/* Demo Buttons */}
        <motion.div
          className="flex gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addExperience(25)}
            className="flex-1 bg-green-500 hover:bg-green-600 py-2 px-4 rounded font-semibold transition"
          >
            +25 XP
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => levelUp()}
            className="flex-1 bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded font-semibold transition"
          >
            Level Up
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
