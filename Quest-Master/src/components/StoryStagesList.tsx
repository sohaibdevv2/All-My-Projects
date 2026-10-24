'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function StoryStagesList() {
  const {
    storyStages,
    currentStoryStage,
    completeStoryStage,
    setCurrentStoryStage,
  } = useGameStore();

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

  // Group stages by chapter
  const chapters = Array.from(
    new Map(
      storyStages.map((stage) => [
        stage.chapter,
        storyStages.filter((s) => s.chapter === stage.chapter),
      ])
    ).values()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Story Progression
      </h2>

      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {chapters.map((chapterStages, chapterIdx) => {
          const chapter = chapterStages[0].chapter;
          const completedCount = chapterStages.filter((s) => s.isCompleted).length;
          const totalCount = chapterStages.length;

          return (
            <motion.div
              key={chapter}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-l-4 border-blue-500"
            >
              {/* Chapter Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
                <h3 className="text-xl font-bold mb-2">Chapter {chapter}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Progress</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-blue-900 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(completedCount / totalCount) * 100}%`,
                        }}
                        transition={{ duration: 0.5 }}
                        className="bg-green-400 h-full rounded-full"
                      />
                    </div>
                    <span className="text-sm font-semibold">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stages */}
              <div className="p-4 space-y-3">
                {chapterStages.map((stage, stageIdx) => {
                  const isActive = currentStoryStage === stage.id;
                  const isCompleted = stage.isCompleted;

                  return (
                    <motion.div
                      key={stage.id}
                      whileHover={{ scale: isCompleted ? 1 : 1.02 }}
                      onClick={() => setCurrentStoryStage(stage.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        isCompleted
                          ? 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-700'
                          : isActive
                            ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-400'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-2xl"
                            >
                              {isCompleted ? '✓' : '●'}
                            </motion.span>
                            <h4
                              className={`text-lg font-bold ${
                                isCompleted
                                  ? 'text-green-700 dark:text-green-300'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {stage.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {stage.description}
                          </p>
                        </div>
                      </div>

                      {/* Rewards */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                            ⭐ {stage.rewards.experience} XP
                          </span>
                        </div>
                        {stage.rewards.skillUnlocks.length > 0 && (
                          <div className="text-sm">
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              🔓 Unlocks:{' '}
                            </span>
                            {stage.rewards.skillUnlocks.join(', ')}
                          </div>
                        )}
                      </motion.div>

                      {/* Complete Button */}
                      {!isCompleted && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            completeStoryStage(stage.id);
                          }}
                          className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
                        >
                          Complete Stage
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
