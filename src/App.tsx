/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Scene1Gateway } from './components/Scene1Gateway';
import { Scene2Cake } from './components/Scene2Cake';
import { Scene3LoveLetter } from './components/Scene3LoveLetter';
import { Scene4Reasons } from './components/Scene4Reasons';
import { Scene5MarriageCertificate } from './components/Scene5MarriageCertificate';
import { SceneHugAnimation } from './components/SceneHugAnimation';
import { AppHeader } from './components/AppHeader';
import { HeartRainOverlay } from './components/HeartRainOverlay';
import { PasswordGate } from './components/PasswordGate';
import { SceneType, MoodTheme, GirlFriendProfile } from './types';
import { sound } from './utils/audioSynthesizer';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentScene, setCurrentScene] = useState<SceneType>('scene1');
  const [mood] = useState<MoodTheme>('blush');
  const [boxUnlocked, setBoxUnlocked] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isContinuousRain, setIsContinuousRain] = useState(false);

  // Dedicated romantic profile for Genu's 22/10/2007 birthday (Rinkesh & Genu)
  const profile: GirlFriendProfile = {
    name: 'Genu',
    nickname: 'Genu',
    birthDate: '2007-10-22',
    customNote: 'Happy 19th Birthday to my sweetest Genu! 22 October 2007 ❤️ Rinkesh & Genu forever.',
  };

  const handleUnlockBox = () => {
    setBoxUnlocked(true);
  };

  const handleBlowCandles = () => {
    setCandlesBlown(true);
  };

  const handleRelightCandles = () => {
    setCandlesBlown(false);
  };

  // Linear app-like step navigation (No tabs! Everything is its own clean chapter):
  const goToScene = (scene: SceneType) => {
    sound.playHeartClick();
    setCurrentScene(scene);
  };

  const handleBackNavigation = () => {
    sound.playHeartClick();
    if (currentScene === 'scene6') setCurrentScene('scene5');
    else if (currentScene === 'scene5') setCurrentScene('scene4');
    else if (currentScene === 'scene4') setCurrentScene('scene3');
    else if (currentScene === 'scene3') setCurrentScene('scene2');
    else if (currentScene === 'scene2') setCurrentScene('scene1');
  };

  const handleRestart = () => {
    sound.playHeartClick();
    setBoxUnlocked(false);
    setCandlesBlown(false);
    setCurrentScene('scene1');
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#0c040d] text-rose-100 overflow-hidden select-none">
      {/* 3D WebGL Canvas Layer (Mounted in isolated ref container) */}
      <ThreeCanvas
        currentScene={currentScene}
        mood={mood}
        boxUnlocked={boxUnlocked}
        candlesBlown={candlesBlown}
        onBoxClick={() => {
          if (!boxUnlocked) handleUnlockBox();
        }}
        onCandleClick={() => {
          if (!candlesBlown) handleBlowCandles();
        }}
      />

      {/* Interactive Heart Rain Animation Overlay (Click anywhere triggers romantic subtle rain) */}
      <HeartRainOverlay isContinuousRain={isContinuousRain} />

      {/* Password Gate Login Page (Password: 2622) */}
      <AnimatePresence>
        {!isAuthenticated && (
          <PasswordGate onSuccess={() => setIsAuthenticated(true)} />
        )}
      </AnimatePresence>

      {/* Top Mobile App Story Header with Progress Bars & Controls */}
      {isAuthenticated && (
        <AppHeader
          currentScene={currentScene}
          onBack={handleBackNavigation}
          isContinuousRain={isContinuousRain}
          onToggleRain={() => setIsContinuousRain((prev) => !prev)}
        />
      )}

      {/* Active Scene Overlay with Smooth App-like Transitions (No Tabs!) */}
      {isAuthenticated && (
        <main className="relative z-10 w-full h-[100dvh] max-h-[100dvh] pointer-events-none overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Chapter 1: The Surprise Gift Box */}
            {currentScene === 'scene1' && (
              <motion.div
                key="scene1"
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <Scene1Gateway
                  profile={profile}
                  isUnlocked={boxUnlocked}
                  onUnlock={handleUnlockBox}
                  onProceedToScene2={() => goToScene('scene2')}
                />
              </motion.div>
            )}

            {/* Chapter 2: The 3D Birthday Cake */}
            {currentScene === 'scene2' && (
              <motion.div
                key="scene2"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <Scene2Cake
                  profile={profile}
                  candlesBlown={candlesBlown}
                  onBlowCandles={handleBlowCandles}
                  onRelightCandles={handleRelightCandles}
                  onProceedToScene3={() => goToScene('scene3')}
                />
              </motion.div>
            )}

            {/* Chapter 3: The Dedicated Love Letter to Genu */}
            {currentScene === 'scene3' && (
              <motion.div
                key="scene3"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <Scene3LoveLetter
                  profile={profile}
                  onProceedToNext={() => goToScene('scene4')}
                />
              </motion.div>
            )}

            {/* Chapter 4: 19 Reasons Why Rinkesh Loves Genu */}
            {currentScene === 'scene4' && (
              <motion.div
                key="scene4"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <Scene4Reasons
                  onProceedToNext={() => goToScene('scene5')}
                />
              </motion.div>
            )}

            {/* Chapter 5: Official Marriage & Soulmate Certificate */}
            {currentScene === 'scene5' && (
              <motion.div
                key="scene5"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <Scene5MarriageCertificate
                  profile={profile}
                  onProceedToNext={() => goToScene('scene6')}
                />
              </motion.div>
            )}

            {/* Chapter 6: Grand Finale - Warm Birthday Hug Animation */}
            {currentScene === 'scene6' && (
              <motion.div
                key="scene6"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <SceneHugAnimation
                  profile={profile}
                  onRestart={handleRestart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}
    </div>
  );
}
