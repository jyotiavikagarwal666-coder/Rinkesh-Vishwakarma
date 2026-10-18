import React, { useEffect, useRef } from 'react';
import { sound } from '../utils/audioSynthesizer';

interface HeartRainProps {
  isContinuousRain?: boolean;
}

interface RainingHeart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  swaySpeed: number;
  swayDist: number;
  opacity: number;
  color: string;
  char: string;
}

const HEART_SYMBOLS = ['💖', '💕', '❤️', '✨'];
const HEART_COLORS = ['#fb7185', '#f43f5e', '#fda4af', '#fde047'];
const MAX_HEARTS = 16; // strict limit to prevent screen occlusion

export const HeartRainOverlay: React.FC<HeartRainProps> = ({ isContinuousRain = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartsRef = useRef<RainingHeart[]>([]);
  const isContinuousRef = useRef(isContinuousRain);
  const lastClickTimeRef = useRef(0);

  useEffect(() => {
    isContinuousRef.current = isContinuousRain;
  }, [isContinuousRain]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const spawnHeart = (startX?: number, startY?: number) => {
      // Respect max capacity so screen stays crystal clear
      if (heartsRef.current.length >= MAX_HEARTS) {
        heartsRef.current.shift(); // remove oldest
      }

      const x = startX !== undefined ? startX + (Math.random() - 0.5) * 60 : Math.random() * width;
      const y = startY !== undefined ? startY - Math.random() * 20 : -30;

      heartsRef.current.push({
        x,
        y,
        size: Math.random() * 6 + 12, // small, delicate 12px-18px (not huge!)
        speedY: Math.random() * 2.0 + 1.8,
        speedX: (Math.random() - 0.5) * 1.0,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        swaySpeed: Math.random() * 0.03 + 0.02,
        swayDist: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.3 + 0.4, // subtle, translucent (never blinding)
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        char: HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)],
      });
    };

    // Spawn gentle 3-4 hearts on screen click (throttled, never on buttons/inputs)
    const handleScreenClick = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      if (now - lastClickTimeRef.current < 350) return; // throttle clicks
      lastClickTimeRef.current = now;

      // Don't spawn if clicking interactive buttons, inputs, tabs, or cards
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, input, textarea, a, [role="button"]')) {
        return;
      }

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      // Spawn only 3 to 4 tiny hearts around the tap
      const count = Math.floor(Math.random() * 2) + 3;
      for (let i = 0; i < count; i++) {
        spawnHeart(clientX, clientY);
      }
    };

    window.addEventListener('pointerdown', handleScreenClick);

    // Animation render loop
    let animId: number;
    let frameCount = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      frameCount++;

      ctx.clearRect(0, 0, width, height);

      // In continuous rain mode, spawn 1 delicate heart every 25 frames
      if (isContinuousRef.current && frameCount % 25 === 0) {
        spawnHeart(Math.random() * width, -20);
      }

      const hearts = heartsRef.current;
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];

        h.y += h.speedY;
        h.x += Math.sin(frameCount * h.swaySpeed) * h.swayDist + h.speedX;
        h.rotation += h.rotSpeed;

        // Fade out smoothly
        if (h.y > height - 150) {
          h.opacity -= 0.02;
        }

        if (h.y > height + 20 || h.opacity <= 0.02) {
          hearts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, h.opacity);
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);

        ctx.font = `${h.size}px -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(h.char, 0, 0);

        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handleScreenClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 w-full h-full"
    />
  );
};
