'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayerProgressCard } from '@/components/PlayerProgressCard';
import { SkillsPanel } from '@/components/SkillsPanel';
import { StoryStagesList } from '@/components/StoryStagesList';
import { NarrativeEngine } from '@/components/NarrativeEngine';
import { AccomplishmentsDisplay } from '@/components/AccomplishmentsDisplay';
import { TechBadgesDisplay } from '@/components/TechBadgesDisplay';
import { ProjectHighlights } from '@/components/ProjectHighlights';
import { usePersistentGameState } from '@/hooks/usePersistentGameState';
import { usePersistentNarrativeState } from '@/hooks/usePersistentNarrativeState';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'game' | 'narrative'>('game');
  const { isLoaded: gameLoaded } = usePersistentGameState();
  const { isLoaded: narrativeLoaded } = usePersistentNarrativeState();
  const { resetGame } = useGameStore();

  const isLoaded = gameLoaded && narrativeLoaded;

  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-bold text-gray-600 dark:text-gray-400"
        >
          Loading your adventure...
        </motion.div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            ⚔️ Quest Master
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Embark on an epic journey of skill development and story progression
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => resetGame()}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
          >
            🔄 Reset Game
          </motion.button>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('game')}
            className={`px-6 py-3 font-semibold rounded-lg transition ${
              activeTab === 'game'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            ⚔️ Quest Game
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('narrative')}
            className={`px-6 py-3 font-semibold rounded-lg transition ${
              activeTab === 'narrative'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            🚀 Career Journey
          </motion.button>
        </motion.div>

        {/* Game Tab Content */}
        {activeTab === 'game' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Player Progress - Left Column */}
              <div className="lg:col-span-1">
                <PlayerProgressCard />
              </div>

              {/* Skills Panel - Middle & Right Columns */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <SkillsPanel />
              </div>
            </div>

            {/* Story Stages - Full Width */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-12">
              <StoryStagesList />
            </div>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <p>
                💾 Your progress is automatically saved to your browser's local storage.
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Narrative Tab Content */}
        {activeTab === 'narrative' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 mb-12"
          >
            {/* Narrative Engine */}
            <NarrativeEngine />

            {/* Accomplishments */}
            <AccomplishmentsDisplay />

            {/* Tech Badges */}
            <TechBadgesDisplay />

            {/* Project Highlights */}
            <ProjectHighlights />

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <p>
                💾 Your career journey is automatically saved to your browser's local storage.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
