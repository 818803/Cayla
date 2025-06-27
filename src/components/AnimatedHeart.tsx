import React, { useRef, useEffect, useState } from 'react';

const AnimatedHeartFinal: React.FC<{ isFinishing?: boolean }> = ({ isFinishing = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const particles = useRef<any[]>([]);
  const time = useRef(0);
  const [climaxStarted, setClimaxStarted] = useState(false);

  useEffect(() => {
    if (isFinishing) {
      setClimaxStarted(true);
    }
  }, [isFinishing]);

  const config = {
    particleCount: 4500,
    baseScale: 36, // Balanced starting size
    beatFrequency: 1.5,
    beatIntensity: 0.18, // Adjusted for the new scale
    particleBaseSpeed: 0.01,
    particleLife: 500,
    color: 'rgba(255, 20, 50, 0.9)',
    glowColor: 'rgba(255, 20, 50, 0.25)',
    fov: 300,
  };

  const heartEquation = (t: number) => {
    const x = 16 * Math.sin(t) ** 3;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
  };

  const createParticle = (canvas: HTMLCanvasElement) => {
    const angle = Math.random() * 2 * Math.PI;
    const radiusMultiplier = Math.pow(Math.random(), 3);

    return {
      x: 0, y: 0, z: Math.random() * 2 - 1,
      vx: 0, vy: 0, vz: 0,
      life: Math.random() * config.particleLife,
      initialLife: config.particleLife,
      size: Math.random() * 1.8 + 0.8,
      speed: config.particleBaseSpeed + Math.random() * 0.01,
      angle: angle,
      radiusMultiplier: radiusMultiplier,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    if (particles.current.length === 0) {
      for (let i = 0; i < config.particleCount; i++) {
        particles.current.push(createParticle(canvas));
      }
    }

    const animate = () => {
      time.current += 0.015;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 30;
      ctx.shadowColor = config.glowColor;

      const beatProgress = (Math.sin(time.current * config.beatFrequency) + 1) / 2;
      const beat = 1 + config.beatIntensity * Math.pow(beatProgress, 3);

      particles.current.forEach((p, i) => {
        if (climaxStarted) {
            if (!p.climaxVx) {
                const explosionAngleXY = Math.atan2(p.y, p.x);
                const explosionAngleZ = Math.random() * Math.PI - Math.PI / 2;
                const explosionSpeed = 15 + Math.random() * 20;

                p.climaxVx = Math.cos(explosionAngleXY) * Math.cos(explosionAngleZ) * explosionSpeed;
                p.climaxVy = Math.sin(explosionAngleXY) * Math.cos(explosionAngleZ) * explosionSpeed;
                p.climaxVz = Math.sin(explosionAngleZ) * explosionSpeed;
            }
            p.climaxVx *= 0.99;
            p.climaxVy *= 0.99;
            p.climaxVz *= 0.99;

            p.x += p.climaxVx;
            p.y += p.climaxVy;
            p.z += p.climaxVz;
            p.life -= 2.5;

        } else {
            const heartPoint = heartEquation(p.angle);
            const targetScale = config.baseScale * beat * p.radiusMultiplier;
            const targetX = heartPoint.x * targetScale;
            const targetY = heartPoint.y * targetScale;
            
            p.vx += (targetX - p.x) * p.speed;
            p.vy += (targetY - p.y) * p.speed;
            p.vx *= 0.9;
            p.vy *= 0.9;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 1;
        }

        const perspective = config.fov / (config.fov + p.z * 100);
        const projectedX = centerX + p.x * perspective;
        const projectedY = centerY + p.y * perspective;
        const projectedSize = Math.max(0, p.size * perspective);

        const fade = Math.max(0, p.life / p.initialLife);
        ctx.fillStyle = config.color;
        ctx.globalAlpha = fade;
        
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
            particles.current[i] = createParticle(canvas);
        }
      });
      
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [climaxStarted]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', background: 'transparent' }} />;
};

export default AnimatedHeartFinal; 