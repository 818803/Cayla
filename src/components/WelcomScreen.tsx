"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";

function BeatingHeart() {
  const ref = useRef<Mesh>(null);
  const scaleRef = useRef(1);
  const directionRef = useRef(1);
  
  useFrame(() => {
    if (!ref.current) return;

    const newScale = scaleRef.current + directionRef.current * 0.01;
    if (newScale > 1.3 || newScale < 0.9) {
      directionRef.current *= -1;
    }
    scaleRef.current = newScale;
    ref.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

export default function WelcomeScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    // Start fade out after 2.2 seconds
    const fadeTimer = setTimeout(() => {
      setShouldFadeOut(true);
    }, 2200);

    // Complete removal after 3 seconds total
    const removeTimer = setTimeout(() => {
      handleFinish();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [handleFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center text-white transition-all duration-1000 ${
        shouldFadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 3D Heart */}
        <div className="w-48 h-48 mb-8">
          <Canvas
            camera={{ position: [0, 0, 5] }}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff69b4" />
            <BeatingHeart />
          </Canvas>
        </div>

        {/* Welcome text */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300 animate-pulse">
            Welcome to Cayla
          </h1>
          <p className="text-lg text-pink-200/80 font-light tracking-wide">
            Your journey to emotional clarity begins now
          </p>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 flex space-x-2">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-pink-300/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}