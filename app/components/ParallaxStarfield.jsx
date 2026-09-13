'use client';
import { useEffect, useRef } from 'react';

const LAYERS = [
  { count: 300, rMin: 0.3, rMax: 0.8, factor: 0.008 },
  { count: 80,  rMin: 1.0, rMax: 2.0, factor: 0.025 },
  { count: 20,  rMin: 2.0, rMax: 4.0, factor: 0.06  },
];

function makeStars(count, rMin, rMax, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * (rMax - rMin) + rMin,
    opacity: Math.random(),
    delta: (Math.random() * 0.004 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
  }));
}

export default function ParallaxStarfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const offsets = LAYERS.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));

    // Set canvas size first, then build stars with correct dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let layers = LAYERS.map((l) =>
      makeStars(l.count, l.rMin, l.rMax, canvas.width, canvas.height)
    );

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      layers = LAYERS.map((l) =>
        makeStars(l.count, l.rMin, l.rMax, canvas.width, canvas.height)
      );
    };

    const onMouse = (e) => {
      const mx = e.clientX - window.innerWidth / 2;
      const my = e.clientY - window.innerHeight / 2;
      LAYERS.forEach((l, i) => {
        offsets[i].tx = -mx * l.factor;
        offsets[i].ty = -my * l.factor;
      });
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      LAYERS.forEach((layerDef, i) => {
        offsets[i].x += (offsets[i].tx - offsets[i].x) * 0.06;
        offsets[i].y += (offsets[i].ty - offsets[i].y) * 0.06;

        layers[i].forEach((s) => {
          s.opacity += s.delta;
          if (s.opacity >= 1 || s.opacity <= 0) s.delta *= -1;

          const px = (s.x + offsets[i].x + canvas.width) % canvas.width;
          const py = (s.y + offsets[i].y + canvas.height) % canvas.height;

          ctx.beginPath();
          ctx.arc(px, py, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${s.opacity * (0.5 + i * 0.25)})`;
          ctx.fill();
        });
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}
