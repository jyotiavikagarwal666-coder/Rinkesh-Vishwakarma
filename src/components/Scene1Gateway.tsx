import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audioSynthesizer';
import { GirlFriendProfile } from '../types';
import confetti from 'canvas-confetti';

interface Scene1GatewayProps {
  profile: GirlFriendProfile;
  isUnlocked: boolean;
  onUnlock: () => void;
  onProceedToScene2: () => void;
}

export const Scene1Gateway: React.FC<Scene1GatewayProps> = ({
  profile,
  isUnlocked,
  onUnlock,
  onProceedToScene2,
}) => {
  const [daysCount, setDaysCount] = useState(6940);

  useEffect(() => {
    const birth = new Date(2007, 9, 22);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysCount(diffDays || 6940);
  }, []);

  const handleUnlockAction = () => {
    sound.playHeartClick();
    sound.playRomanticChord();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fde047', '#ffffff'],
    });
    onUnlock();
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-4 pt-14 pb-5 pointer-events-none overflow-hidden">
      {/* Top Mobile Title & Milestone */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-auto flex flex-col items-center text-center max-w-sm mx-auto z-10 w-full"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-950/70 border border-rose-500/30 text-rose-300 text-[11px] mb-2 backdrop-blur-md shadow-md">
          <Calendar className="w-3 h-3 text-rose-400" />
          <span className="font-medium tracking-wide">22 October 2007 • Turning 19</span>
          <Sparkles className="w-3 h-3 text-amber-300" />
        </div>

        <h1 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 leading-tight">
          Happy Birthday, <span className="font-cursive text-rose-400 text-3xl sm:text-4xl">{profile.name || 'Genu'}</span>!
        </h1>

        <p className="mt-1 text-rose-200/80 text-xs font-light max-w-xs">
          &ldquo;22/10/2007: The day the universe sent down its prettiest angel.&rdquo;
        </p>

        {/* 3 Compact Milestone Pills */}
        <div className="grid grid-cols-3 gap-2 mt-3 w-full max-w-xs">
          <div className="glass-panel px-2 py-1.5 rounded-xl text-center">
            <div className="text-base font-bold text-rose-300 font-serif-romantic">19</div>
            <div className="text-[9px] text-rose-200/70 uppercase">Years</div>
          </div>
          <div className="glass-panel px-2 py-1.5 rounded-xl text-center">
            <div className="text-base font-bold text-amber-300 font-serif-romantic">{daysCount.toLocaleString()}</div>
            <div className="text-[9px] text-rose-200/70 uppercase">Days</div>
          </div>
          <div className="glass-panel px-2 py-1.5 rounded-xl text-center">
            <div className="text-base font-bold text-rose-400 font-serif-romantic">Infinite</div>
            <div className="text-[9px] text-rose-200/70 uppercase">Love</div>
          </div>
        </div>
      </motion.div>

      {/* Center 3D Gift Box Viewport */}
      <div className="flex-1 w-full flex items-center justify-center pointer-events-none" />

      {/* Bottom Clean Action Card */}
      <div className="pointer-events-auto z-10 w-full max-w-xs mx-auto mb-2">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-4 rounded-2xl text-center backdrop-blur-md border-rose-500/30 shadow-xl"
            >
              <p className="text-xs text-rose-200/90 mb-3">
                Tap below to open your 19th birthday gift! 🎁
              </p>

              <button
                onClick={handleUnlockAction}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 shadow-lg shadow-rose-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Tap To Open Birthday Surprise 🎁</span>
                <Heart className="w-4 h-4 fill-white text-white" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-4 rounded-2xl text-center border-rose-400/50 shadow-xl backdrop-blur-md"
            >
              <div className="inline-flex items-center gap-1 text-xs text-amber-300 font-medium mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Gift Unlocked! 💖</span>
              </div>
              <p className="text-xs text-rose-200/80 mb-3 font-light">
                The glowing heart is revealed. Let&apos;s celebrate with your 3D cake!
              </p>

              <button
                onClick={() => {
                  sound.playHeartClick();
                  onProceedToScene2();
                }}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 shadow-lg shadow-rose-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Continue To 3D Birthday Cake 🎂</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
