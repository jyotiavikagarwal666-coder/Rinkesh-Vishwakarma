import React from 'react';
import { ChevronLeft, Music, Heart } from 'lucide-react';
import { SceneType } from '../types';
import { sound } from '../utils/audioSynthesizer';

interface AppHeaderProps {
  currentScene: SceneType;
  onBack?: () => void;
  isContinuousRain: boolean;
  onToggleRain: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentScene,
  onBack,
  isContinuousRain,
  onToggleRain,
}) => {
  const [isBgmPlaying, setIsBgmPlaying] = React.useState(false);

  const toggleBgm = () => {
    const playing = sound.toggleAmbientBGM();
    setIsBgmPlaying(playing);
  };

  const getSceneStep = () => {
    switch (currentScene) {
      case 'scene1': return 1;
      case 'scene2': return 2;
      case 'scene3': return 3;
      case 'scene4': return 4;
      case 'scene5': return 5;
      case 'scene6': return 6;
      default: return 1;
    }
  };

  const step = getSceneStep();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 pt-2 pb-1.5 pointer-events-auto bg-gradient-to-b from-black/90 via-black/60 to-transparent">
      {/* 6 Story Progress Segments */}
      <div className="flex items-center gap-1 max-w-md mx-auto mb-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              step >= i
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 shadow-sm shadow-rose-500'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Left: Back Button or Heart Date Badge */}
        <div className="flex items-center gap-1">
          {step > 1 ? (
            <button
              onClick={() => {
                sound.playHeartClick();
                if (onBack) onBack();
              }}
              className="p-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-200 hover:text-white transition cursor-pointer active:scale-95 flex items-center gap-0.5 text-xs pr-2.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-[11px] text-rose-300">
              <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
              <span>22.10.2007</span>
            </div>
          )}
        </div>

        {/* Center: Title of current page */}
        <div className="text-center">
          <span className="font-serif-romantic text-xs sm:text-sm font-semibold text-rose-100 block">
            {step === 1 && '🎁 1. Surprise Gift'}
            {step === 2 && '🎂 2. 19th Birthday Cake'}
            {step === 3 && '💌 3. Love Letter'}
            {step === 4 && '💖 4. 19 Reasons'}
            {step === 5 && '💍 5. Marriage Certificate'}
            {step === 6 && '🫂 6. Birthday Hug'}
          </span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playHeartClick();
              onToggleRain();
            }}
            className={`p-1.5 rounded-full border transition cursor-pointer ${
              isContinuousRain
                ? 'bg-rose-500 border-rose-300 text-white shadow-sm shadow-rose-500'
                : 'bg-rose-950/60 border-rose-500/30 text-rose-300 hover:text-white'
            }`}
            title="Heart Rain"
          >
            <Heart className={`w-3.5 h-3.5 ${isContinuousRain ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={toggleBgm}
            className={`p-1.5 rounded-full border transition cursor-pointer ${
              isBgmPlaying
                ? 'bg-rose-600/70 border-rose-400 text-white shadow-sm shadow-rose-600'
                : 'bg-rose-950/60 border-rose-500/30 text-rose-300 hover:text-white'
            }`}
            title="Romantic Music"
          >
            <Music className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
