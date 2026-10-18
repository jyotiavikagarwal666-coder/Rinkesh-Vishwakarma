import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Sparkles, Heart, ArrowRight, RefreshCw, Scissors } from 'lucide-react';
import { sound } from '../utils/audioSynthesizer';
import { GirlFriendProfile } from '../types';
import confetti from 'canvas-confetti';

interface Scene2CakeProps {
  profile: GirlFriendProfile;
  candlesBlown: boolean;
  onBlowCandles: () => void;
  onRelightCandles: () => void;
  onProceedToScene3: () => void;
}

export const Scene2Cake: React.FC<Scene2CakeProps> = ({
  profile,
  candlesBlown,
  onBlowCandles,
  onRelightCandles,
  onProceedToScene3,
}) => {
  const [cakeCut, setCakeCut] = useState(false);

  const handleBlowAction = () => {
    sound.playCandleBlow();
    setTimeout(() => {
      sound.playHappyBirthdayMelody();
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fde047', '#38bdf8', '#ffffff'],
      });
    }, 350);
    onBlowCandles();
  };

  const handleCutCake = () => {
    sound.playHeartClick();
    sound.playConfettiPop();
    setCakeCut(true);
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-4 pt-14 pb-5 pointer-events-none overflow-hidden">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto flex flex-col items-center text-center max-w-sm mx-auto z-10 w-full"
      >
        <h1 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 leading-tight">
          Make A Wish, <span className="font-cursive text-rose-400 text-3xl sm:text-4xl">{profile.name || 'Genu'}</span>!
        </h1>
        <p className="mt-1 text-rose-200/80 text-xs font-light">
          Close your eyes, make a secret wish, and blow out your 19th birthday candles!
        </p>
      </motion.div>

      {/* Center 3D Cake Viewport */}
      <div className="flex-1 w-full flex items-center justify-center pointer-events-none" />

      {/* Bottom Clean Action Card */}
      <div className="pointer-events-auto z-10 w-full max-w-xs mx-auto mb-2">
        <AnimatePresence mode="wait">
          {!candlesBlown ? (
            <motion.div
              key="burning"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-4 rounded-2xl text-center backdrop-blur-md border-rose-500/30 shadow-xl"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>19th Birthday Candles Are Glowing</span>
              </div>

              <button
                onClick={handleBlowAction}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 shadow-lg shadow-rose-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wind className="w-4 h-4 text-cyan-200" />
                <span>Blow The Candles! 🎂</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="blown"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-4 rounded-2xl text-center border-rose-400/50 shadow-xl backdrop-blur-md"
            >
              <div className="inline-flex items-center gap-1 text-xs text-amber-300 font-medium mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wish Granted! Happy 19th Birthday 💖</span>
              </div>

              <div className="flex items-center gap-2 mb-3 mt-1.5">
                {!cakeCut ? (
                  <button
                    onClick={handleCutCake}
                    className="flex-1 py-2 px-3 rounded-xl font-semibold text-white text-xs bg-gradient-to-r from-amber-500 to-rose-600 shadow-md flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Cut First Cake Slice 🍰</span>
                  </button>
                ) : (
                  <div className="flex-1 py-2 px-2 rounded-xl bg-rose-900/50 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-center justify-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>First Slice Cut! 💖</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    sound.playHeartClick();
                    onRelightCandles();
                  }}
                  className="p-2 rounded-xl bg-black/40 border border-rose-500/30 text-rose-300 text-xs cursor-pointer"
                  title="Relight candles"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Direct Next Button to Love Letter */}
              <button
                onClick={() => {
                  sound.playHeartClick();
                  onProceedToScene3();
                }}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 shadow-lg shadow-rose-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Read My Love Letter 💌</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
