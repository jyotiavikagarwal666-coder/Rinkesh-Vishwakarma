import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowRight, Stamp } from 'lucide-react';
import { sound } from '../utils/audioSynthesizer';
import { GirlFriendProfile } from '../types';
import confetti from 'canvas-confetti';

interface Scene5MarriageCertificateProps {
  profile: GirlFriendProfile;
  onProceedToNext: () => void;
}

export const Scene5MarriageCertificate: React.FC<Scene5MarriageCertificateProps> = ({
  profile,
  onProceedToNext,
}) => {
  const [isSealStamped, setIsSealStamped] = useState(false);

  const handleStampCertificate = () => {
    sound.playRomanticChord();
    sound.playConfettiPop();
    setIsSealStamped(true);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#f43f5e', '#ec4899', '#ffffff'],
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
          Our Eternal Certificate
        </h1>
        <p className="mt-0.5 text-rose-200/80 text-xs font-light">
          A sacred bond sealed by destiny and true love.
        </p>
      </motion.div>

      {/* Royal Marriage Certificate Document Card */}
      <div className="pointer-events-auto z-10 w-full max-w-sm mx-auto flex-1 my-2 min-h-0 flex flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="bg-[#fffdf9] text-stone-900 p-4 sm:p-5 rounded-2xl border-2 border-amber-600/70 shadow-2xl relative overflow-y-auto flex-1 flex flex-col justify-between"
        >
          {/* Corner filigree decorations */}
          <div className="absolute top-2 left-2 text-amber-600/60 text-xs font-serif">⚜️</div>
          <div className="absolute top-2 right-2 text-amber-600/60 text-xs font-serif">⚜️</div>
          <div className="absolute bottom-2 left-2 text-amber-600/60 text-xs font-serif">⚜️</div>
          <div className="absolute bottom-2 right-2 text-amber-600/60 text-xs font-serif">⚜️</div>

          {/* Certificate Header */}
          <div className="text-center border-b border-amber-500/40 pb-2 mb-2">
            <div className="text-lg">👑 💍 👑</div>
            <h3 className="font-serif-romantic text-sm sm:text-base font-bold tracking-wider uppercase text-amber-900">
              Certificate of Eternal Marriage
            </h3>
            <p className="text-[9px] uppercase tracking-widest text-amber-700 font-semibold mt-0.5">
              And Soulmate Covenant
            </p>
          </div>

          {/* Declaration */}
          <div className="text-center space-y-1 my-2">
            <p className="text-[9px] text-stone-600 uppercase tracking-wider">
              Under the witness of the Stars & the Universe, this certifies that
            </p>

            {/* Couple Names */}
            <div className="py-1 flex items-center justify-center gap-2">
              <span className="font-serif-romantic text-xl font-bold text-rose-800">
                Rinkesh
              </span>
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="font-serif-romantic text-xl font-bold text-rose-800">
                Genu
              </span>
            </div>

            <p className="text-[9px] text-amber-800 font-mono">
              Bride Born: 22 October 2007 • Turning 19
            </p>

            <p className="font-serif-romantic text-[11px] leading-relaxed text-stone-700 italic px-2">
              &ldquo;are hereby bound in eternal love, laughter, and sacred togetherness for this lifetime and all lifetimes to come.&rdquo;
            </p>
          </div>

          {/* Vows Summary */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2 my-2 text-[10px] text-stone-700 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-rose-500">❤️</span>
              <span>To love, protect, and cherish each other unconditionally.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-rose-500">❤️</span>
              <span>To make Genu smile every single day of her life.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-rose-500">❤️</span>
              <span>To stay soulmates forever and always.</span>
            </div>
          </div>

          {/* Official Signatures Section */}
          <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-amber-400/60">
            {/* Groom's Signature */}
            <div className="text-center">
              <div className="h-8 flex items-end justify-center">
                <span className="font-cursive text-2xl text-rose-900 font-bold tracking-wide transform -rotate-3">
                  Rinkesh
                </span>
              </div>
              <div className="w-24 h-0.5 bg-amber-800/40 mx-auto mt-0.5" />
              <span className="text-[9px] uppercase tracking-wider text-stone-600 block mt-1 font-semibold">
                Groom: Rinkesh
              </span>
            </div>

            {/* Bride's Signature */}
            <div className="text-center">
              <div className="h-8 flex items-end justify-center">
                <span className="font-cursive text-2xl text-rose-900 font-bold tracking-wide transform rotate-2">
                  Genu
                </span>
              </div>
              <div className="w-24 h-0.5 bg-amber-800/40 mx-auto mt-0.5" />
              <span className="text-[9px] uppercase tracking-wider text-stone-600 block mt-1 font-semibold">
                Bride: Genu
              </span>
            </div>
          </div>

          {/* Interactive Official Wax Seal */}
          <div className="mt-3 pt-2 border-t border-amber-300 flex flex-col items-center">
            {!isSealStamped ? (
              <button
                onClick={handleStampCertificate}
                className="py-1.5 px-3.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Stamp className="w-3.5 h-3.5" />
                <span>Stamp Golden Eternal Seal</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 animate-scale-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
                  RG
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-amber-900 block leading-tight">
                    SEALED FOR ETERNITY ❤️
                  </span>
                  <span className="text-[8px] text-stone-500 font-mono">
                    Registry: RG-22102007-FOREVER
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Direct Next Button to Grand Finale Hug Animation */}
      <div className="pointer-events-auto z-10 w-full max-w-xs mx-auto">
        <button
          onClick={() => {
            sound.playHeartClick();
            onProceedToNext();
          }}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 shadow-lg shadow-rose-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Grand Finale: A Warm Hug For Genu 🫂</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
