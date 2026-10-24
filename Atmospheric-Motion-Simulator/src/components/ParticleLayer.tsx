import { motion } from 'motion/react';
import { Snowflake } from 'lucide-react';
import { Particle } from '../types';

interface ParticleLayerProps {
  particles: Particle[];
}

export function ParticleLayer({ particles }: ParticleLayerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {particles.map((p) => {
        if (p.type === 'snowflake') {
          return (
            <motion.div
              key={p.id}
              initial={{ y: '-5vh', x: `${p.startX}vw`, opacity: 0, rotate: p.rotate }}
              animate={{
                y: '105vh',
                x: `${p.startX + p.drift}vw`,
                opacity: [0, 0.9, 0.9, 0],
                rotate: p.rotate + 360,
              }}
              transition={{
                duration: p.duration,
                ease: 'linear',
                times: [0, 0.1, 0.88, 1],
              }}
              className="absolute text-blue-300 pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
              }}
            >
              <Snowflake size={p.size} className="w-full h-full stroke-[1.25]" />
            </motion.div>
          );
        } else {
          // Balloon
          return (
            <motion.div
              key={p.id}
              initial={{ y: '105vh', x: `${p.startX}vw`, opacity: 0 }}
              animate={{
                y: '-18vh',
                x: `${p.startX + p.drift}vw`,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                ease: 'easeOut',
                times: [0, 0.15, 0.88, 1],
              }}
              className="absolute flex flex-col items-center pointer-events-none"
              style={{
                width: p.size,
              }}
            >
              {/* Balloon high-fidelity physical shape */}
              <div
                className="rounded-t-full rounded-b-[40%] relative shadow-md"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size * 1.3}px`,
                  backgroundColor: p.color || '#f43f5e',
                  boxShadow: 'inset -5px -8px 16px rgba(0,0,0,0.22), inset 4px 4px 10px rgba(255,255,255,0.4)',
                }}
              >
                {/* Visual specularity highlight */}
                <div className="absolute top-[12%] left-[15%] w-[24%] h-[18%] bg-white/45 rounded-full blur-[0.5px]" />
                
                {/* Soft knot tie */}
                <div
                  className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent"
                  style={{ borderBottom: `6px solid ${p.color || '#f43f5e'}` }}
                />
              </div>
              
              {/* Wavy thin rope to ground */}
              <svg 
                width="14" 
                height="48" 
                viewBox="0 0 14 48" 
                fill="none" 
                className="opacity-40 text-slate-400 mt-[1px]"
              >
                <path 
                  d="M7 0 C2 12, 12 18, 7 28 C2 38, 12 42, 7 48" 
                  strokeWidth="0.8" 
                  stroke="currentColor" 
                  fill="none" 
                />
              </svg>
            </motion.div>
          );
        }
      })}
    </div>
  );
}
