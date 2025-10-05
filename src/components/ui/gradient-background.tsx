'use client';

import { cn } from '~/lib/utils';
import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';

interface GradientBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  layers?: number;
  points?: number;
  variance?: number;
  speed?: number;
  pulseSpeed?: number;
}

function randomHSL(hMin: number, hMax: number, sMin = 60, sMax = 80, lMin = 50, lMax = 70) {
  const h = Math.floor(Math.random() * (hMax - hMin) + hMin);
  const s = Math.floor(Math.random() * (sMax - sMin) + sMin);
  const l = Math.floor(Math.random() * (lMax - lMin) + lMin);
  return { h, s, l };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function generatePoints(count: number, variance: number) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    xTarget: Math.random() * 100,
    yTarget: Math.random() * 100,
  }));
}

export function GradientBackground({
  layers = 2,
  points = 20,
  variance = 5,
  speed = 0.0002,
  pulseSpeed = 0.002,
  className,
  ...props
}: GradientBackgroundProps) {
  const [gradientColors, setGradientColors] = useState(
    Array.from({ length: layers }, () => ({
      from: randomHSL(250, 280),
      via: randomHSL(180, 210),
      to: randomHSL(270, 300),
      angle: Math.random() * 360,
    }))
  );

  const [polyPoints, setPolyPoints] = useState(generatePoints(points, variance));
  const [pulse, setPulse] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      setGradientColors((prev) =>
        prev.map((g) => ({
          ...g,
          angle: (g.angle + delta * speed * 0.1) % 360,
        }))
      );

      setPolyPoints((prev) =>
        prev.map((p) => {
          let { x, y, xTarget, yTarget } = p;
          x = lerp(x, xTarget, speed * delta);
          y = lerp(y, yTarget, speed * delta);

          if (Math.abs(x - xTarget) < 0.5) xTarget = Math.random() * 100;
          if (Math.abs(y - yTarget) < 0.5) yTarget = Math.random() * 100;

          return { x, y, xTarget, yTarget };
        })
      );

      setPulse(Math.sin(time * pulseSpeed) * 0.15 + 0.85);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [speed, pulseSpeed]);

  const gradientStyle = gradientColors
    .map(
      (g) =>
        `linear-gradient(${g.angle}deg, hsl(${g.from.h},${g.from.s}%,${g.from.l}%) 0%, hsl(${g.via.h},${g.via.s}%,${g.via.l}%) 50%, hsl(${g.to.h},${g.to.s}%,${g.to.l}%) 100%)`
    )
    .join(', ');

  const polygonString = polyPoints.map((p) => `${p.x.toFixed(1)}% ${p.y.toFixed(1)}%`).join(', ');

  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed inset-0 -z-10 transform-gpu overflow-hidden opacity-36 blur-3xl',
        className
      )}
      {...props}
    >
      <div
        className="w-full h-full absolute opacity-36"
        style={{
          background: gradientStyle,
          clipPath: `polygon(${polygonString})`,
          opacity: pulse,
        }}
      />
    </div>
  );
}
