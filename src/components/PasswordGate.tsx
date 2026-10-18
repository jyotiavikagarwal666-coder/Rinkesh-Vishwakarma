import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Heart, Sparkles, KeyRound, Delete } from 'lucide-react';
import { sound } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

interface PasswordGateProps {
  onSuccess: () => void;
}

const CORRECT_PASSWORD = '2622';

export const PasswordGate: React.FC<PasswordGateProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    sound.playHeartClick();
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);
    setErrorMsg('');

    if (newPin === CORRECT_PASSWORD) {
      triggerUnlock();
    } else if (newPin.length === 4 && newPin !== CORRECT_PASSWORD) {
      triggerError();
    }
  };

  const handleDelete = () => {
    sound.playHeartClick();
    setPin((prev) => prev.slice(0, -1));
    setError(false);
    setErrorMsg('');
  };

  const triggerError = () => {
    setError(true);
    setErrorMsg('Galat password! Secret code: 2622 ❤️');
    setTimeout(() => {
      setPin('');
      setError(false);
    }, 1100);
  };

  const triggerUnlock = () => {
    setIsSuccess(true);
    sound.playConfettiPop();
    sound.playRomanticChord();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fde047', '#ffffff'],
    });

    setTimeout(() => {
      onSuccess();
    }, 800);
  };

  // Allow physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a030b] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs glass-panel p-5 rounded-3xl border-rose-500/40 shadow-2xl relative z-10 text-center backdrop-blur-xl"
      >
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-300 text-[11px] mb-2.5">
          <Lock className="w-3 h-3 text-rose-400" />
          <span>Private Love Surprise • 22.10.2007</span>
        </div>

        <h1 className="font-serif-romantic text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 leading-tight">
          Birthday Secret Gate
        </h1>
        <p className="text-[11px] text-rose-300/80 mt-0.5 mb-4">
          Sirf password dalo aur surprise unlock karo!
        </p>

        {/* 4-Digit Password Display */}
        <motion.div
          animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="flex justify-center items-center gap-3 mb-4"
        >
          {[0, 1, 2, 3].map((idx) => {
            const hasChar = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-11 h-12 rounded-xl flex items-center justify-center font-bold text-base border transition-all ${
                  hasChar
                    ? 'border-rose-400 bg-rose-950/70 text-rose-200 shadow-md shadow-rose-950'
                    : 'border-rose-500/25 bg-black/40 text-rose-300/30'
                } ${error ? 'border-red-500 bg-red-950/30' : ''}`}
              >
                {hasChar ? (
                  <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500/30" />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Error / Success message */}
        <div className="min-h-[18px] mb-3">
          {errorMsg && (
            <p className="text-[11px] text-amber-300 font-medium">
              {errorMsg}
            </p>
          )}
          {isSuccess && (
            <p className="text-[11px] text-emerald-300 font-medium flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Access Granted! Opening... 💖</span>
            </p>
          )}
        </div>

        {/* Numeric On-Screen Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 active:scale-95 border border-rose-500/20 text-rose-100 font-semibold text-base transition cursor-pointer shadow-sm"
            >
              {num}
            </button>
          ))}

          {/* Quick Hint / Fill Button */}
          <button
            type="button"
            onClick={() => {
              sound.playHeartClick();
              setPin('2622');
              triggerUnlock();
            }}
            className="w-full py-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/50 border border-rose-500/20 text-amber-300 text-[10px] font-medium transition cursor-pointer flex flex-col items-center justify-center"
            title="Auto-enter password 2622"
          >
            <KeyRound className="w-3 h-3 mb-0.5" />
            <span>2622</span>
          </button>

          {/* Zero */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 active:scale-95 border border-rose-500/20 text-rose-100 font-semibold text-base transition cursor-pointer"
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            onClick={handleDelete}
            className="w-full py-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/50 border border-rose-500/20 text-rose-300 hover:text-white transition cursor-pointer flex items-center justify-center"
            title="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-rose-300/60 mt-2">
          Password: <strong className="text-amber-300 font-mono">2622</strong>
        </p>
      </motion.div>
    </div>
  );
};
