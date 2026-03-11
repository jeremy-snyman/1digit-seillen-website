import { useEffect, useRef, useState } from 'react';

// --- Types ---

interface WispParticle {
  x: number;
  y: number;
  length: number;
  thickness: number;
  opacity: number;
  speed: number;
  phase: number;
  waveAmp: number;
  waveFreq: number;
  layer: number; // 0 = back, 1 = mid, 2 = front
  direction: number; // 1 or -1
}

// --- Particle Factory ---

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createWispParticle(w: number, h: number, layer: number): WispParticle {
  const layerConfigs = [
    // Back layer: long, thick, very faint, slow
    { lMin: 300, lMax: 600, tMin: 20, tMax: 40, oMin: 0.03, oMax: 0.08, sMin: 0.1, sMax: 0.3 },
    // Mid layer: medium length, moderate
    { lMin: 200, lMax: 450, tMin: 12, tMax: 30, oMin: 0.05, oMax: 0.12, sMin: 0.2, sMax: 0.5 },
    // Front layer: shorter, thinner, slightly more visible, faster
    { lMin: 150, lMax: 350, tMin: 8, tMax: 20, oMin: 0.08, oMax: 0.18, sMin: 0.4, sMax: 0.8 },
  ];
  const cfg = layerConfigs[layer];
  const direction = Math.random() > 0.3 ? 1 : -1;

  return {
    x: Math.random() * (w + 400) - 200,
    y: Math.random() * h,
    length: rand(cfg.lMin, cfg.lMax),
    thickness: rand(cfg.tMin, cfg.tMax),
    opacity: rand(cfg.oMin, cfg.oMax),
    speed: rand(cfg.sMin, cfg.sMax) * direction,
    phase: Math.random() * Math.PI * 2,
    waveAmp: rand(8, 30),
    waveFreq: rand(0.003, 0.008),
    layer,
    direction,
  };
}

// --- Theme Config ---

interface ThemeColors {
  blendMode: 'screen' | 'multiply';
  opacity: number;
  wisp: (o: number) => string;
  reducedBg: string;
}

const themeColors: Record<string, ThemeColors> = {
  dark: {
    blendMode: 'screen',
    opacity: 0.85,
    wisp: (o) => `rgba(210, 220, 235, ${o})`,
    reducedBg: `
      radial-gradient(ellipse at 30% 50%, rgba(30,30,35,0.5) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 40%, rgba(40,45,55,0.3) 0%, transparent 50%)
    `,
  },
  light: {
    blendMode: 'multiply',
    opacity: 0.25,
    wisp: (o) => `rgba(140, 130, 160, ${o})`,
    reducedBg: `
      radial-gradient(ellipse at 30% 50%, rgba(200,190,220,0.3) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 40%, rgba(180,170,200,0.2) 0%, transparent 50%)
    `,
  },
};

function getTheme(): string {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

// --- Component ---

export default function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = useRef(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(getTheme());
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') {
          setTheme(getTheme());
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tc = themeColors[theme] || themeColors.dark;

    // Offscreen canvas for rendering
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d')!;

    let animationId: number;
    let particles: WispParticle[] = [];
    let time = 0;
    let lastFrameTime = 0;
    let displayW = 0;
    let displayH = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      displayW = rect.width;
      displayH = rect.height;

      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = rect.width < 768;
      const renderScale = isMobile ? 0.35 : 0.5;
      offscreen.width = Math.floor(rect.width * renderScale);
      offscreen.height = Math.floor(rect.height * renderScale);

      // Distribute particles across layers
      const counts = isMobile ? [4, 6, 4] : [6, 10, 6];
      particles = [];
      for (let layer = 0; layer < 3; layer++) {
        for (let i = 0; i < counts[layer]; i++) {
          particles.push(createWispParticle(rect.width, rect.height, layer));
        }
      }
    }

    function drawWisp(
      offCtx: CanvasRenderingContext2D,
      p: WispParticle,
      scaleX: number,
      scaleY: number,
      time: number,
      colorFn: (o: number) => string,
    ) {
      const segments = 12;
      const cx = p.x * scaleX;
      const cy = p.y * scaleY;
      const len = p.length * scaleX;
      const thick = p.thickness * scaleY;

      // Build center spine points with sine undulation
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const px = cx + (t - 0.5) * len * p.direction;
        const wave = Math.sin(t * Math.PI * 2 * p.waveFreq * 200 + time * 0.0012 + p.phase) * p.waveAmp * scaleY;
        const py = cy + wave;
        points.push({ x: px, y: py });
      }

      // Taper envelope: thickest at center, tapered at edges
      function envelope(t: number): number {
        // Smooth taper: sin^2 shape
        return Math.sin(t * Math.PI) * Math.sin(t * Math.PI);
      }

      // Draw filled wisp shape using top and bottom curves
      offCtx.save();

      // Create gradient along the wisp length
      const grad = offCtx.createLinearGradient(
        points[0].x, points[0].y,
        points[points.length - 1].x, points[points.length - 1].y,
      );
      grad.addColorStop(0, colorFn(0));
      grad.addColorStop(0.2, colorFn(p.opacity * 0.6));
      grad.addColorStop(0.5, colorFn(p.opacity));
      grad.addColorStop(0.8, colorFn(p.opacity * 0.6));
      grad.addColorStop(1, colorFn(0));

      offCtx.fillStyle = grad;
      offCtx.beginPath();

      // Top edge (forward)
      const firstEnv = envelope(0) * thick * 0.5;
      offCtx.moveTo(points[0].x, points[0].y - firstEnv);
      for (let i = 1; i < points.length; i++) {
        const t = i / segments;
        const halfThick = envelope(t) * thick * 0.5;
        const prev = points[i - 1];
        const curr = points[i];
        const cpx = (prev.x + curr.x) / 2;
        const cpy = (prev.y + curr.y) / 2 - (envelope((i - 0.5) / segments) * thick * 0.5);
        offCtx.quadraticCurveTo(prev.x, prev.y - envelope((i - 1) / segments) * thick * 0.5, cpx, cpy);
      }
      // Connect to last top point
      const lastIdx = points.length - 1;
      const lastEnv = envelope(1) * thick * 0.5;
      offCtx.lineTo(points[lastIdx].x, points[lastIdx].y - lastEnv);

      // Bottom edge (backward)
      offCtx.lineTo(points[lastIdx].x, points[lastIdx].y + lastEnv);
      for (let i = points.length - 2; i >= 0; i--) {
        const t = i / segments;
        const prev = points[i + 1];
        const curr = points[i];
        const cpx = (prev.x + curr.x) / 2;
        const cpy = (prev.y + curr.y) / 2 + (envelope((i + 0.5) / segments) * thick * 0.5);
        offCtx.quadraticCurveTo(prev.x, prev.y + envelope((i + 1) / segments) * thick * 0.5, cpx, cpy);
      }
      offCtx.lineTo(points[0].x, points[0].y + firstEnv);
      offCtx.closePath();
      offCtx.fill();
      offCtx.restore();
    }

    function draw(timestamp: number) {
      const isMobile = displayW < 768;
      const frameInterval = isMobile ? 1000 / 24 : 1000 / 40;
      if (timestamp - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = timestamp;

      if (!isVisible.current) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const w = displayW;
      const h = displayH;
      const offW = offscreen.width;
      const offH = offscreen.height;
      const scaleX = offW / w;
      const scaleY = offH / h;

      offCtx.clearRect(0, 0, offW, offH);

      // Render each layer with appropriate blur
      const layerBlurs = isMobile ? [20, 12, 6] : [25, 15, 8];

      for (let layer = 0; layer < 3; layer++) {
        offCtx.save();
        offCtx.filter = `blur(${layerBlurs[layer]}px)`;
        offCtx.globalCompositeOperation = 'lighter';

        for (const p of particles) {
          if (p.layer !== layer) continue;

          // Move particle
          p.x += p.speed;
          p.y += Math.sin(time * 0.0006 + p.phase) * 0.08;

          // Wrap around edges
          const margin = p.length * 0.6 + 100;
          if (p.speed > 0 && p.x > w + margin) p.x = -margin;
          if (p.speed < 0 && p.x < -margin) p.x = w + margin;
          if (p.y < -100) p.y = h + 100;
          if (p.y > h + 100) p.y = -100;

          drawWisp(offCtx, p, scaleX, scaleY, time, tc.wisp);
        }

        offCtx.restore();
      }

      // Composite to visible canvas
      ctx!.clearRect(0, 0, w, h);
      ctx!.drawImage(offscreen, 0, 0, offW, offH, 0, 0, w, h);

      time++;
      animationId = requestAnimationFrame(draw);
    }

    // Intersection Observer — pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [prefersReducedMotion, theme]);

  const tc = themeColors[theme] || themeColors.dark;

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0"
        style={{
          mixBlendMode: tc.blendMode as any,
          opacity: tc.opacity * 0.6,
          background: tc.reducedBg,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: tc.blendMode as any, opacity: tc.opacity }}
    />
  );
}
