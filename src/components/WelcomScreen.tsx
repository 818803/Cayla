"use client";
import { useEffect, useState, useCallback } from "react";
import AnimatedHeart from './AnimatedHeart';

// Fullscreen Welcome Screen
export default function WelcomeScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setShouldFadeOut(true);
    }, 4000);

    const removeTimer = setTimeout(() => {
      handleFinish();
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [handleFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center text-white transition-all duration-1000 ${
        shouldFadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Centered container passing the isFinishing prop */}
      <div className="absolute inset-0 z-20">
        <AnimatedHeart isFinishing={shouldFadeOut} />
      </div>
    </div>
  );
}
