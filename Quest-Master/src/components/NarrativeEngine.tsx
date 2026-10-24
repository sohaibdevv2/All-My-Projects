'use client';

import { motion } from 'framer-motion';
import { useNarrativeStore } from '@/store/narrativeStore';

export function NarrativeEngine() {
  const {
    narrativeStarted,
    narrativeEnded,
    currentNodeId,
    startNarrative,
    getCurrentNode,
    makeChoice,
    resetNarrative,
  } = useNarrativeStore();

  const currentNode = getCurrentNode();

  if (!narrativeStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-8 text-white shadow-2xl"
      >
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          🚀 Your Tech Career Adventure
        </motion.h2>
        <motion.p
          className="text-lg mb-6 text-indigo-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Make choices that shape your career path, unlock new technologies, and build amazing projects.
          Each decision matters. Let your journey begin!
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startNarrative}
          className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-indigo-50 transition text-lg"
        >
          Start Your Journey
        </motion.button>
      </motion.div>
    );
  }

  if (!currentNode) {
    return <div>Story node not found</div>;
  }

  return (
    <motion.div
      key={currentNodeId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
    >
      {/* Story Title */}
      <motion.h2
        className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {currentNode.title}
      </motion.h2>

      {/* Story Text */}
      <motion.p
        className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {currentNode.text}
      </motion.p>

      {/* Choices */}
      {!narrativeEnded && currentNode.choices.length > 0 ? (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          {currentNode.choices.map((choice, index) => (
            <motion.button
              key={choice.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => makeChoice(choice.id)}
              className="w-full text-left p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition shadow-md border-l-4 border-blue-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">→</span>
                <span className="font-semibold">{choice.text}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      ) : narrativeEnded ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-2 border-green-400 dark:border-green-600 rounded-lg p-6 mb-8"
        >
          <p className="text-green-900 dark:text-green-100 font-semibold text-lg mb-4">
            🎉 Congratulations! You've completed your journey!
          </p>
          <p className="text-green-800 dark:text-green-200 mb-6">
            Scroll down to see all the accomplishments, technologies, and projects you've unlocked along the way.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetNarrative}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Start Another Journey
          </motion.button>
        </motion.div>
      ) : null}

      {/* Progress Indicator */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>🎮 Journey Progress:</span>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(narrativeEnded ? 100 : 50)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
