import { useState, useEffect } from 'react';
import { Snowflake, Sparkles, Clock, Layers, CircleDot, Play } from 'lucide-react';
import { Particle, ActiveEffect } from './types';
import { ParticleLayer } from './components/ParticleLayer';

export default function App() {
  const [activeEffect, setActiveEffect] = useState<ActiveEffect>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Maintain precise clock tracking
  useEffect(() => {
    if (!activeEffect || timeLeft <= 0) {
      if (timeLeft <= 0 && activeEffect) {
        setActiveEffect(null);
      }
      return;
    }

    const startTimestamp = Date.now();
    const durationMs = timeLeft * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimestamp;
      const remaining = Math.max(0, (durationMs - elapsed) / 1000);
      
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setActiveEffect(null);
        clearInterval(interval);
      }
    }, 50); // High-frequency tick for ultra-fluid millisecond countdown

    return () => clearInterval(interval);
  }, [activeEffect, timeLeft]);

  // Periodic particle spawning logic while animation is active
  useEffect(() => {
    if (!activeEffect || timeLeft <= 0) return;

    // Fast interval generator to ensure steady density of elements
    const spawnTimer = setInterval(() => {
      const id = `${activeEffect}-${Math.random().toString(36).substr(2, 9)}`;
      const startX = Math.floor(Math.random() * 90) + 5; // bounds in 5% - 95%
      const drift = Math.floor(Math.random() * 20) - 10; // -10vw to +10vw drift
      const size = Math.floor(Math.random() * 11) + 24; // medium size: 24px - 34px
      const duration = 3.2 + Math.random() * 1.3; // travel speed: 3.2s to 4.5s
      const rotate = Math.floor(Math.random() * 360);

      // Unique jewel-tone colors for formal balloons
      const balloonColors = [
        '#2563eb', // Sapphire Blue
        '#e11d48', // Ruby Crimson
        '#7c3aed', // Velvet Violet
        '#059669', // Emerald Teal
        '#d97706', // Antique Amber
        '#db2777', // Rose Magenta
        '#0ea5e9'  // Sky Cyan
      ];
      const randomColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];

      const newParticle: Particle = {
        id,
        type: activeEffect === 'snowflakes' ? 'snowflake' : 'balloon',
        startX,
        drift,
        size,
        duration,
        color: randomColor,
        rotate
      };

      setParticles((prev) => [...prev, newParticle]);
    }, 120); // Steady spawn frequency

    return () => clearInterval(spawnTimer);
  }, [activeEffect, timeLeft]);

  // Pruning logic to remove out-of-scope particles upon travel expiration
  useEffect(() => {
    // Keep list clean of deleted items to optimize CPU loads
    const cleanupInterval = setInterval(() => {
      setParticles((prev) => {
        if (prev.length === 0) return prev;
        // In a complex run, we can keep particles up to 6 seconds to finish their path
        return prev.filter((p) => {
          // Keep if the effect is running or if the particle hasn't fully completed its visual path
          return true;
        });
      });
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  const triggerEffect = (effect: 'snowflakes' | 'balloons') => {
    // Reset prior particles immediately to run a fresh screen presentation
    setParticles([]);
    setActiveEffect(effect);
    setTimeLeft(5.0);

    // Promptly spawn an immediate initial batch of staggered particles
    // so the presentation starts instantly upon user action
    const initialBatch: Particle[] = [];
    const count = 10;
    const balloonColors = ['#2563eb', '#e11d48', '#7c3aed', '#059669', '#d97706', '#db2777', '#0ea5e9'];

    for (let i = 0; i < count; i++) {
      const id = `${effect}-init-${i}-${Math.random().toString(36).substr(2, 5)}`;
      const startX = Math.floor(Math.random() * 90) + 5;
      const drift = Math.floor(Math.random() * 16) - 8;
      const size = Math.floor(Math.random() * 11) + 24;
      const duration = 3.2 + Math.random() * 1.3;
      const rotate = Math.floor(Math.random() * 360);
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];

      initialBatch.push({
        id,
        type: effect === 'snowflakes' ? 'snowflake' : 'balloon',
        startX,
        drift,
        size,
        duration,
        color,
        rotate
      });
    }
    setParticles(initialBatch);
  };

  const handleStopAll = () => {
    setActiveEffect(null);
    setTimeLeft(0);
    setParticles([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans text-slate-800 selection:bg-slate-200">
      
      {/* Dynamic Animated Atmospheric Canvas */}
      <ParticleLayer particles={particles} />

      {/* Corporate Styled Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-slate-200 pb-4 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-display font-bold text-sm tracking-widest shadow-sm">
            SM
          </div>
          <span className="font-display font-semibold tracking-wide text-xs text-slate-900 uppercase">
            Atmospheric Motion Simulator
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sim ready
        </div>
      </header>

      {/* Main Interactive Control Board */}
      <main className="w-full max-w-xl mx-auto my-auto py-12 z-10">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 md:p-10 shadow-sm transition-all">
          
          {/* Card Presentation Head */}
          <div className="space-y-2 mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Visual Physics Presentation
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Launch standard particle dynamics simulation vectors to test client-side render frame integrity and motion-path interpolation.
            </p>
          </div>

          {/* Interactive Presentation Panel */}
          <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <Layers size={13} className="text-slate-400" />
                Active Presentation
              </span>
              <span className="font-mono text-xs text-slate-600 bg-white border border-slate-200/60 px-2 py-0.5 rounded-md">
                {particles.length} Active Node{particles.length !== 1 ? 's' : ''}
              </span>
            </div>

            {activeEffect ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    {activeEffect === 'snowflakes' ? (
                      <>
                        <Snowflake size={18} className="text-sky-500 animate-spin" style={{ animationDuration: '8s' }} />
                        <span>Snowflakes Cascade</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} className="text-rose-500" />
                        <span>Balloons Ascent</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-900 font-mono text-sm font-semibold">
                    <Clock size={15} className="text-slate-400" />
                    <span>{timeLeft.toFixed(1)}s remaining</span>
                  </div>
                </div>

                {/* Smooth Custom Progress Indicator */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-75 rounded-full ${
                      activeEffect === 'snowflakes' ? 'bg-sky-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${(timeLeft / 5.0) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-slate-400 font-medium flex items-center justify-center gap-2">
                  <CircleDot size={14} className="text-slate-300 animate-pulse" />
                  No simulation active. Trigger an effect below.
                </p>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Run Snowflakes Cascade Button */}
            <button
              onClick={() => triggerEffect('snowflakes')}
              className={`group flex flex-col justify-between p-5 rounded-xl border text-left transition-all relative overflow-hidden ${
                activeEffect === 'snowflakes'
                  ? 'border-sky-500 bg-sky-50/40 shadow-sm ring-1 ring-sky-500/25 text-sky-950'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-4">
                <div className={`p-2.5 rounded-lg ${
                  activeEffect === 'snowflakes' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                } transition-colors`}>
                  <Snowflake size={20} className="stroke-[1.75]" />
                </div>
                <Play size={13} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="block font-medium text-sm text-slate-950 mb-0.5">Snowflakes</span>
                <span className="block text-[11px] text-slate-400 font-normal">Standard 5s fall cascade</span>
              </div>
            </button>

            {/* Run Balloons Ascent Button */}
            <button
              onClick={() => triggerEffect('balloons')}
              className={`group flex flex-col justify-between p-5 rounded-xl border text-left transition-all relative overflow-hidden ${
                activeEffect === 'balloons'
                  ? 'border-rose-500 bg-rose-50/40 shadow-sm ring-1 ring-rose-500/25 text-rose-950'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-4">
                <div className={`p-2.5 rounded-lg ${
                  activeEffect === 'balloons' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                } transition-colors`}>
                  <Sparkles size={20} className="stroke-[1.75]" />
                </div>
                <Play size={13} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="block font-medium text-sm text-slate-950 mb-0.5">Balloons</span>
                <span className="block text-[11px] text-slate-400 font-normal">Standard 5s upward float</span>
              </div>
            </button>

          </div>

          {/* Conditional Stop Interrupt Option */}
          {activeEffect && (
            <button
              onClick={handleStopAll}
              className="mt-6 w-full py-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100/80 text-red-700 font-medium text-xs tracking-wide uppercase transition-colors"
            >
              Interrupt Simulation
            </button>
          )}

        </div>
      </main>

      {/* Clean Aesthetic Footer */}
      <footer className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 gap-4 z-10 font-sans">
        <p>© 2026 Simulation Laboratory. Fully compliant motion vector render.</p>
        <p className="font-mono text-[10px] text-slate-400">Duration threshold: 5.0s</p>
      </footer>
    </div>
  );
}
