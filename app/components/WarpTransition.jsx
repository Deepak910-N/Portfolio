'use client';
import { useRouter } from 'next/navigation';
import { useRef, useCallback } from 'react';

export function useWarpTransition() {
  const router = useRouter();
  const runningRef = useRef(false);

  const triggerWarp = useCallback((href) => {
    if (runningRef.current) return;
    runningRef.current = true;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const BG = 'rgb(2,6,20)';

    const stars = Array.from({ length: 240 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1.5;
      return { x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
    });

    let frame = 0;
    const WARP_FRAMES = 50; // ~830ms at 60fps

    const draw = () => {
      const progress = frame / WARP_FRAMES;

      // Trail fill — gets darker as warp peaks
      ctx.fillStyle = `rgba(2,6,20,${0.22 + progress * 0.45})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        const tailLen = Math.max(2, 16 * progress * Math.abs(s.vx) * 0.45);
        const alpha = Math.min(1, 0.45 + progress * 0.8);
        const grad = ctx.createLinearGradient(
          s.x - s.vx * tailLen, s.y - s.vy * tailLen, s.x, s.y
        );
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, `rgba(210,230,255,${alpha})`);
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * tailLen, s.y - s.vy * tailLen);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.0 + progress * 1.4;
        ctx.stroke();

        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 1.08;
        s.vy *= 1.08;
      });

      frame++;

      if (frame < WARP_FRAMES) {
        requestAnimationFrame(draw);
        return;
      }

      // ── Warp complete ──────────────────────────────────────────────
      // 1. Flash white-blue briefly
      ctx.fillStyle = 'rgba(190,215,255,0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Fill solid BG colour — canvas now acts as a seamless cover
      setTimeout(() => {
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 3. Push route while canvas still fully covers the screen
        router.push(href);

        // 4. Fade canvas out after giving new page time to paint (~350ms)
        setTimeout(() => {
          let fadeFrame = 0;
          const FADE = 36; // ~600ms fade
          const fade = () => {
            fadeFrame++;
            const t = fadeFrame / FADE;
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease-in-out
            canvas.style.opacity = String(1 - ease);
            if (fadeFrame < FADE) {
              requestAnimationFrame(fade);
            } else {
              canvas.remove();
              runningRef.current = false;
            }
          };
          requestAnimationFrame(fade);
        }, 380);
      }, 40);
    };

    requestAnimationFrame(draw);
  }, [router]);

  return triggerWarp;
}
