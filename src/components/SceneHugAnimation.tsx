import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audioSynthesizer';
import { GirlFriendProfile } from '../types';
import confetti from 'canvas-confetti';

interface SceneHugAnimationProps {
  profile: GirlFriendProfile;
  onRestart: () => void;
}

export const SceneHugAnimation: React.FC<SceneHugAnimationProps> = ({
  profile,
  onRestart,
}) => {
  const [hugTightness, setHugTightness] = useState(1);
  const [isHuggingTightly, setIsHuggingTightly] = useState(false);
  const [hugCount, setHugCount] = useState(1);

  // Play gentle heartbeat on load
  useEffect(() => {
    sound.playHeartbeat();
    const interval = setInterval(() => {
      sound.playHeartbeat();
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleTightHug = () => {
    sound.playHeartbeat();
    sound.playRomanticChord();
    setIsHuggingTightly(true);
    setHugTightness((prev) => Math.min(prev + 0.15, 1.4));
    setHugCount((prev) => prev + 1);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047'],
    });

    setTimeout(() => {
      setIsHuggingTightly(false);
    }, 1200);
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-4 pt-14 pb-5 pointer-events-none overflow-hidden">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto flex flex-col items-center text-center max-w-sm mx-auto z-10 w-full"
      >
        <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-rose-950/70 border border-rose-500/30 text-rose-300 text-[11px] mb-1.5 shadow-md">
          <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
          <span>The Grand Finale • Virtual Birthday Hug</span>
        </div>

        <h1 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 leading-tight">
          A Warm Hug For <span className="font-cursive text-rose-400 text-3xl sm:text-4xl">{profile.name || 'Genu'}</span>
        </h1>

        <p className="mt-0.5 text-rose-200/80 text-xs font-light">
          &ldquo;Tere gale lag kar hi meri duniya poori hoti hai.&rdquo;
        </p>
      </motion.div>

      {/* Center Interactive Animated Couple Hug Scene */}
      <div className="pointer-events-auto z-10 w-full max-w-sm mx-auto flex-1 my-2 min-h-0 flex flex-col items-center justify-center relative">
        {/* Soft glowing romantic backdrop aura */}
        <motion.div
          animate={{
            scale: isHuggingTightly ? [1, 1.3, 1.1] : [1, 1.08, 1],
            opacity: isHuggingTightly ? [0.6, 0.9, 0.7] : [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-rose-600/30 via-pink-500/25 to-amber-500/20 blur-3xl pointer-events-none"
        />

        {/* Animated Hug SVG Graphic with moving arms and pulsating heart */}
        <motion.div
          animate={{
            scale: isHuggingTightly ? 1.08 : [1, 1.03, 1],
            y: [0, -4, 0],
          }}
          transition={{
            scale: { duration: 0.4 },
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="relative w-56 h-56 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full drop-shadow-2xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft Warm Radial Glow */}
            <circle cx="120" cy="120" r="100" fill="url(#hugGlow)" opacity="0.25" />

            {/* Left Figure (Rinkesh) */}
            <g transform={`translate(${isHuggingTightly ? 16 : 8}, 0)`}>
              {/* Body */}
              <ellipse cx="90" cy="155" rx="36" ry="50" fill="#9f1239" />
              {/* Head */}
              <circle cx="92" cy="85" r="24" fill="#fecdd3" />
              {/* Hair */}
              <path
                d="M72 80 C74 65, 105 62, 114 74 C112 60, 85 58, 72 80 Z"
                fill="#27111a"
              />
              {/* Left Arm wrapping around Genu */}
              <motion.path
                d={
                  isHuggingTightly
                    ? 'M 105 130 C 130 135, 155 145, 142 165 C 130 180, 105 160, 95 150 Z'
                    : 'M 105 132 C 125 138, 148 148, 138 165 C 128 178, 105 160, 95 150 Z'
                }
                fill="#881337"
                stroke="#fda4af"
                strokeWidth="1.5"
              />
            </g>

            {/* Right Figure (Genu) */}
            <g transform={`translate(${isHuggingTightly ? -16 : -8}, 0)`}>
              {/* Body in Rose/Blush Dress */}
              <ellipse cx="150" cy="158" rx="34" ry="48" fill="#e11d48" />
              {/* Head */}
              <circle cx="148" cy="88" r="23" fill="#ffe4e6" />
              {/* Beautiful Long Flowing Hair */}
              <path
                d="M130 82 C132 66, 165 64, 168 84 C175 105, 172 135, 162 145 C158 135, 162 95, 130 82 Z"
                fill="#3b1120"
              />
              {/* Hair Flower / Tiara */}
              <circle cx="162" cy="78" r="4.5" fill="#fde047" />
              {/* Right Arm wrapping around Rinkesh */}
              <motion.path
                d={
                  isHuggingTightly
                    ? 'M 135 135 C 110 140, 85 150, 98 170 C 110 185, 135 165, 145 155 Z'
                    : 'M 135 137 C 115 142, 92 152, 102 170 C 112 182, 135 165, 145 155 Z'
                }
                fill="#be123c"
                stroke="#fda4af"
                strokeWidth="1.5"
              />
            </g>

            {/* Central Pulsating Glowing Love Heart */}
            <motion.path
              animate={{
                scale: isHuggingTightly ? [1, 1.35, 1.2] : [1, 1.15, 1],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              d="M 120 128 C 114 116, 100 116, 96 126 C 92 136, 106 150, 120 162 C 134 150, 148 136, 144 126 C 140 116, 126 116, 120 128 Z"
              fill="#ff2e63"
              stroke="#ffffff"
              strokeWidth="2"
              className="origin-center"
              style={{ transformOrigin: '120px 140px' }}
            />

            {/* Little floating sparkles */}
            <circle cx="70" cy="90" r="2.5" fill="#fde047" />
            <circle cx="175" cy="100" r="2" fill="#fda4af" />
            <circle cx="120" cy="65" r="3" fill="#ffffff" />

            <defs>
              <radialGradient id="hugGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Romantic Warm Quote Card */}
        <div className="glass-panel p-3.5 rounded-2xl text-center border-rose-500/30 max-w-xs mt-1 shadow-lg backdrop-blur-md">
          <p className="font-script text-lg sm:text-xl text-rose-300 font-bold leading-snug">
            &ldquo;Happy 19th Birthday Genu... no distance can ever keep my arms from holding you.&rdquo;
          </p>
          <p className="text-[10px] text-rose-200/80 mt-1 font-mono">
            Always holding you tight in my heart • Rinkesh ❤️
          </p>
        </div>
      </div>

      {/* Bottom Actions: Tight Hug Button & Replay */}
      <div className="pointer-events-auto z-10 w-full max-w-xs mx-auto space-y-2">
        <button
          onClick={handleTightHug}
          className="w-full py-3.5 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 shadow-xl shadow-rose-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
          <span>Tap To Give Genu A Tight Hug 🫂</span>
        </button>

        <button
          onClick={() => {
            sound.playHeartClick();
            onRestart();
          }}
          className="w-full py-2 px-3 rounded-xl font-medium text-rose-300 text-xs bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
          <span>Replay Full Surprise From Beginning ↺</span>
        </button>
      </div>
    </div>
  );
};
