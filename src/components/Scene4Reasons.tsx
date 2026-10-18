import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audioSynthesizer';
import { LoveReason } from '../types';

interface Scene4ReasonsProps {
  onProceedToNext: () => void;
}

export const Scene4Reasons: React.FC<Scene4ReasonsProps> = ({ onProceedToNext }) => {
  const reasons19: LoveReason[] = [
    { id: 1, reason: 'Teri Pyaari Muskaan', subtitle: 'The way your eyes crinkle and light up every time you smile genuinely.', iconName: 'sparkles' },
    { id: 2, reason: '22 October 2007', subtitle: 'The greatest day in history because the universe gave me you.', iconName: 'heart' },
    { id: 3, reason: 'Your Innocent Heart', subtitle: 'How gentle, pure, and deeply caring you are towards everyone around you.', iconName: 'gift' },
    { id: 4, reason: 'Late Night Talks', subtitle: 'Our 2 AM whispering conversations where the entire world fades away.', iconName: 'mail' },
    { id: 5, reason: 'Your Cute Angry Pout', subtitle: 'When you get fake mad at me, but you still smile within two seconds.', iconName: 'sparkles' },
    { id: 6, reason: 'How You Believe In Me', subtitle: 'You give me strength and confidence even on the days I doubt myself.', iconName: 'award' },
    { id: 7, reason: 'Forehead Kisses', subtitle: 'The absolute peace and warmth whenever I hold you close.', iconName: 'heart' },
    { id: 8, reason: 'Effortless Beauty', subtitle: 'You look drop-dead gorgeous in oversized hoodies, messy buns, and everything.', iconName: 'sparkles' },
    { id: 9, reason: 'My Safest Place', subtitle: 'No matter how chaotic the day is, hearing your voice instantly calms my soul.', iconName: 'heart' },
    { id: 10, reason: 'Your Sweet Voice', subtitle: 'My absolute favorite sound in this entire universe.', iconName: 'mail' },
    { id: 11, reason: 'How You Care For Me', subtitle: 'Always reminding me to eat, sleep on time, and take care of myself.', iconName: 'gift' },
    { id: 12, reason: 'Our Inside Jokes', subtitle: 'The silly things only you and I understand and laugh uncontrollably at.', iconName: 'sparkles' },
    { id: 13, reason: 'The Way You Hold My Hand', subtitle: 'Your fingers intertwined with mine feels like coming home.', iconName: 'heart' },
    { id: 14, reason: '19 Years Of Magic', subtitle: 'You are completing 19 years of spreading pure joy and light in this world.', iconName: 'award' },
    { id: 15, reason: 'You Forgive My Flaws', subtitle: 'You accept me with all my imperfections and love me unconditionally.', iconName: 'heart' },
    { id: 16, reason: 'Your Passion & Dreams', subtitle: 'Watching you chase what you love makes me admire you more every day.', iconName: 'sparkles' },
    { id: 17, reason: 'The Butterflies', subtitle: 'Even today, seeing your notification makes my heart skip a beat.', iconName: 'mail' },
    { id: 18, reason: 'My Forever Partner', subtitle: 'Every future plan, every dream I have, has you standing right beside me.', iconName: 'gift' },
    { id: 19, reason: 'Simply You, Genu', subtitle: 'Because there is no one else like you. You are my today, tomorrow, and forever.', iconName: 'heart' },
  ];

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-4 pt-14 pb-5 pointer-events-none overflow-hidden">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto flex flex-col items-center text-center max-w-sm mx-auto z-10 w-full"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-500/30 text-amber-300 text-[11px] mb-1.5 shadow-md">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>One For Every Year Of Your Life</span>
        </div>

        <h1 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 leading-tight">
          19 Reasons Why I Love Genu
        </h1>
        <p className="mt-0.5 text-rose-200/80 text-xs font-light">
          Scroll down to read all 19 reasons ❤️
        </p>
      </motion.div>

      {/* 19 Reasons List Card (Scrollable inside, cleanly contained) */}
      <div className="pointer-events-auto z-10 w-full max-w-sm mx-auto flex-1 my-2 min-h-0 flex flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="flex-1 overflow-y-auto space-y-2 pr-1"
        >
          {reasons19.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-2.5 rounded-xl border border-rose-500/20"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                  #{item.id}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-rose-100 truncate">
                    {item.reason}
                  </h4>
                  <p className="text-[10px] text-rose-300/80 line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Direct Next Button to Chapter 5 (Marriage Certificate) */}
      <div className="pointer-events-auto z-10 w-full max-w-xs mx-auto">
        <button
          onClick={() => {
            sound.playHeartClick();
            onProceedToNext();
          }}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 shadow-lg shadow-rose-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Chapter 5: Our Marriage Certificate 💍</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
