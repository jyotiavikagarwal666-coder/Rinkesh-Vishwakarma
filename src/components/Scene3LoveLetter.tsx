import React from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audioSynthesizer';
import { GirlFriendProfile } from '../types';

interface Scene3LoveLetterProps {
  profile: GirlFriendProfile;
  onProceedToNext: () => void;
}

export const Scene3LoveLetter: React.FC<Scene3LoveLetterProps> = ({
  profile,
  onProceedToNext,
}) => {
  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-4 pt-14 pb-5 pointer-events-none overflow-hidden">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto flex flex-col items-center text-center max-w-sm mx-auto z-10 w-full"
      >
        <h1 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 leading-tight">
          A Letter For <span className="font-cursive text-rose-400 text-3xl sm:text-4xl">{profile.name || 'Genu'}</span>
        </h1>
        <p className="mt-0.5 text-rose-200/80 text-xs font-light">
          Straight from the depths of my heart.
        </p>
      </motion.div>

      {/* Main Handwritten Parchment Card (Scrollable inside, fits mobile screen perfectly) */}
      <div className="pointer-events-auto z-10 w-full max-w-sm mx-auto flex-1 my-2 min-h-0 flex flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="glass-panel-light p-5 rounded-2xl shadow-2xl text-stone-800 flex-1 overflow-y-auto"
        >
          {/* Header */}
          <div className="border-b border-rose-200 pb-2 mb-3">
            <span className="font-script text-xl sm:text-2xl text-rose-600 font-bold block">
              To My Dearest Genu,
            </span>
            <span className="text-[10px] text-rose-400 font-mono">
              Born: 22 October 2007 • 19 Glorious Years • With Endless Love From Rinkesh
            </span>
          </div>

          {/* Letter Body */}
          <div className="font-serif-romantic text-xs sm:text-sm leading-relaxed space-y-3 text-stone-800/95">
            <p>
              <strong>Meri sabse pyaari Genu,</strong>
            </p>
            <p>
              22 October 2007 ko is duniya mein sabse pyaari pari aayi thi. Today, as you celebrate your <strong>19th birthday</strong>, I find myself falling in love with you all over again.
            </p>
            <p>
              Tere chehre ki haseen muskaan, teri aankhon ki chamak, aur teri baaton ki mithaas... sab kuch mere liye khuda ka sabse bada tohfa hai. In these 19 years, you have brought so much light, grace, and pure happiness into this world.
            </p>
            <p>
              Thank you for choosing to hold my hand, for understanding me when words fall short, and for turning every ordinary day into our favorite fairytale.
            </p>
            <p className="font-script text-xl text-rose-700 font-bold">
              &ldquo;Tu meri aadat bhi hai aur meri ibadat bhi... hamesha khush raho meri jaan.&rdquo;
            </p>
            <p>
              May this 19th year bring you as much happiness as you give to my heart every single second.
            </p>
          </div>

          {/* Signoff */}
          <div className="mt-4 pt-3 border-t border-rose-200 flex justify-between items-center text-xs">
            <span className="text-stone-400 text-[10px]">22.10.2007</span>
            <span className="font-script text-lg text-rose-600 font-bold">
              Forever & Always Yours, Rinkesh ❤️
            </span>
          </div>
        </motion.div>
      </div>

      {/* Direct Next Button to Chapter 4 (19 Reasons) */}
      <div className="pointer-events-auto z-10 w-full max-w-xs mx-auto">
        <button
          onClick={() => {
            sound.playHeartClick();
            onProceedToNext();
          }}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 shadow-lg shadow-rose-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Chapter 4: 19 Reasons Why I Love You 💖</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
