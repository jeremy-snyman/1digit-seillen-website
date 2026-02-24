import { useEffect, useRef, useState } from 'react';

// --- Types ---

interface SmokeParticle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
  phase: number;
  life: number;
  lifeSpeed: number;
  curl: number;
}

interface SilkPoint {
  baseX: number;
  baseY: number;
  renderX: number;
  renderY: number;
}

interface SilkRibbon {
  points: SilkPoint[];
  width: number;
  opacity: number;
  phase: number;
  speed: number;
  foldAmplitude: number;
}

// --- Utilities ---

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// --- Particle Factories ---

function createSmokeParticle(w: number, h: number): SmokeParticle {
  return {
    x: Math.random() * w * 0.45,
    y: h * 0.75 + Math.random() * h * 0.35,
    radius: 100 + Math.random() * 180,
    opacity: 0.08 + Math.random() * 0.15,
    vx: 0.6 + Math.random() * 0.8,
    vy: -(0.7 + Math.random() * 1.0),
    phase: Math.random() * Math.PI * 2,
    life: Math.random(),
    lifeSpeed: 0.003 + Math.random() * 0.003,
    curl: 0.8 + Math.random() * 1.0,
  };
}

function createSilkRibbon(w: number, h: number): SilkRibbon {
  const pointCount = 6 + Math.floor(Math.random() * 3); // 6-8 points
  const startX = w * (0.6 + Math.random() * 0.4);
  const startY = h * (0.7 + Math.random() * 0.3);
  const endX = w * (0.25 + Math.random() * 0.35);
  const endY = h * (0.08 + Math.random() * 0.3);

  const points: SilkPoint[] = [];
  for (let i = 0; i < pointCount; i++) {
    const t = i / (pointCount - 1);
    const baseX = lerp(startX, endX, t) + (Math.random() - 0.5) * w * 0.15;
    const baseY = lerp(startY, endY, t) + (Math.random() - 0.5) * h * 0.1;
    points.push({ baseX, baseY, renderX: baseX, renderY: baseY });
  }

  return {
    points,
    width: 8 + Math.random() * 20,
    opacity: 0.25 + Math.random() * 0.4,
    phase: Math.random() * Math.PI * 2,
    speed: 1.4 + Math.random() * 1.0,
    foldAmplitude: 30 + Math.random() * 60,
  };
}

// --- Theme Config ---

interface ThemeColors {
  blendMode: 'screen' | 'multiply';
  opacity: number;
  smoke: (o: number) => [string, string, string];
  halo: (o: number) => string;
  body: (o: number) => string;
  core: (o: number) => string;
  reducedBg: string;
}

const themeColors: Record<string, ThemeColors> = {
  dark: {
    blendMode: 'screen',
    opacity: 0.8,
    smoke: (o) => [
      `rgba(120, 120, 120, ${o})`,
      `rgba(80, 80, 80, ${o * 0.6})`,
      'rgba(0, 0, 0, 0)',
    ],
    halo: (o) => `rgba(160, 160, 160, ${o})`,
    body: (o) => `rgba(220, 220, 220, ${o})`,
    core: (o) => `rgba(250, 250, 250, ${o})`,
    reducedBg: `
      radial-gradient(ellipse at 25% 70%, rgba(30,30,30,0.6) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 35%, rgba(180,180,180,0.08) 0%, transparent 40%)
    `,
  },
  light: {
    blendMode: 'multiply',
    opacity: 0.35,
    smoke: (o) => [
      `rgba(100, 80, 140, ${o})`,
      `rgba(80, 60, 120, ${o * 0.6})`,
      'rgba(255, 255, 255, 0)',
    ],
    halo: (o) => `rgba(100, 80, 140, ${o})`,
    body: (o) => `rgba(80, 60, 120, ${o})`,
    core: (o) => `rgba(60, 40, 100, ${o})`,
    reducedBg: `
      radial-gradient(ellipse at 25% 70%, rgba(200,190,220,0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 35%, rgba(100,80,140,0.08) 0%, transparent 40%)
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
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
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

    // Offscreen canvas for half-res rendering
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d')!;

    let animationId: number;
    let smokeParticles: SmokeParticle[] = [];
    let silkRibbons: SilkRibbon[] = [];
    let time = 0;
    let lastFrameTime = 0;
    let displayW = 0;
    let displayH = 0;

    // Vortex state
    const CYCLE_SECONDS = 3;
    let vortexPhase = 0;
    let vortexCX = 0;
    let vortexCY = 0;

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

      vortexCX = rect.width * 0.5;
      vortexCY = rect.height * 0.42;

      const smokeCount = isMobile ? 18 : 35;
      const ribbonCount = isMobile ? 3 : 5;

      smokeParticles = Array.from({ length: smokeCount }, () =>
        createSmokeParticle(rect.width, rect.height)
      );
      silkRibbons = Array.from({ length: ribbonCount }, () =>
        createSilkRibbon(rect.width, rect.height)
      );
    }

    function draw(timestamp: number) {
      // Frame rate limiting
      const isMobile = displayW < 768;
      const frameInterval = isMobile ? 1000 / 30 : 1000 / 60;
      if (timestamp - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = timestamp;

      // Skip when not visible
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

      // --- Vortex breathing ---
      const cycleSpeed = (2 * Math.PI) / (60 * CYCLE_SECONDS);
      vortexPhase += cycleSpeed;
      const rawBreath = Math.sin(vortexPhase);
      const shapedBreath = Math.sign(rawBreath) * Math.pow(Math.abs(rawBreath), 0.7);
      const pullStrength = shapedBreath * 1.5;

      // Opposition intensities
      const smokeIntensity = 0.55 + 0.45 * (-shapedBreath * 0.5 + 0.5);
      const silkIntensity = 0.45 + 0.55 * (shapedBreath * 0.5 + 0.5);
      const vortexR = Math.min(w, h) * 0.6;

      // --- Clear offscreen ---
      offCtx.clearRect(0, 0, offW, offH);

      // --- Update & Render Smoke ---
      offCtx.save();
      offCtx.filter = `blur(${isMobile ? 20 : 35}px)`;
      offCtx.globalCompositeOperation = 'lighter';

      for (const p of smokeParticles) {
        // Physics
        p.x += p.vx + Math.sin(time * 0.004 + p.phase) * 0.8;
        p.y += p.vy + Math.cos(time * 0.003 + p.phase) * 0.6;

        // Vortex pull
        const dx = vortexCX - p.x;
        const dy = vortexCY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < vortexR && dist > 1) {
          const influence = (1 - dist / vortexR) * pullStrength;
          p.x += dx * influence * 0.004;
          p.y += dy * influence * 0.004;
          // Rotational curl
          p.x += -dy * influence * 0.003 * p.curl;
          p.y += dx * influence * 0.003 * p.curl;
        }

        // Life cycle
        p.life += p.lifeSpeed;
        if (p.life > 1) {
          Object.assign(p, createSmokeParticle(w, h));
          p.life = 0;
        }

        const fadeIn = smoothstep(0, 0.15, p.life);
        const fadeOut = smoothstep(1.0, 0.8, p.life);
        const effectiveOpacity = p.opacity * fadeIn * fadeOut * smokeIntensity;

        // Draw in offscreen coordinates
        const ox = p.x * scaleX;
        const oy = p.y * scaleY;
        const or = p.radius * scaleX;

        const gradient = offCtx.createRadialGradient(ox, oy, 0, ox, oy, or);
        const [s0, s1, s2] = tc.smoke(effectiveOpacity);
        gradient.addColorStop(0, s0);
        gradient.addColorStop(0.4, s1);
        gradient.addColorStop(1, s2);

        offCtx.fillStyle = gradient;
        offCtx.beginPath();
        offCtx.arc(ox, oy, or, 0, Math.PI * 2);
        offCtx.fill();
      }
      offCtx.restore();

      // --- Update & Render Silk Ribbons ---
      offCtx.save();
      offCtx.globalCompositeOperation = 'lighter';

      for (const ribbon of silkRibbons) {
        // Update control points with undulation
        for (let i = 0; i < ribbon.points.length; i++) {
          const cp = ribbon.points[i];

          // Calculate perpendicular direction
          let perpX = 0, perpY = 1;
          if (i > 0 && i < ribbon.points.length - 1) {
            const prev = ribbon.points[i - 1];
            const next = ribbon.points[i + 1];
            const tangentX = next.baseX - prev.baseX;
            const tangentY = next.baseY - prev.baseY;
            const len = Math.sqrt(tangentX * tangentX + tangentY * tangentY) || 1;
            perpX = -tangentY / len;
            perpY = tangentX / len;
          }

          const wave = Math.sin(
            time * ribbon.speed * 0.001 + ribbon.phase + i * 0.9
          ) * ribbon.foldAmplitude;

          cp.renderX = cp.baseX + perpX * wave;
          cp.renderY = cp.baseY + perpY * wave;

          // Vortex influence on ribbons
          const dx = vortexCX - cp.renderX;
          const dy = vortexCY - cp.renderY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < vortexR && dist > 1) {
            const influence = (1 - dist / vortexR) * pullStrength * 0.8;
            cp.renderX += dx * influence * 0.003;
            cp.renderY += dy * influence * 0.003;
          }
        }

        // Build the ribbon path once, reuse for multiple passes
        offCtx.beginPath();
        const p0 = ribbon.points[0];
        offCtx.moveTo(p0.renderX * scaleX, p0.renderY * scaleY);
        for (let i = 1; i < ribbon.points.length - 1; i++) {
          const curr = ribbon.points[i];
          const next = ribbon.points[i + 1];
          const cpx = curr.renderX * scaleX;
          const cpy = curr.renderY * scaleY;
          const endX = (curr.renderX + next.renderX) * 0.5 * scaleX;
          const endY = (curr.renderY + next.renderY) * 0.5 * scaleY;
          offCtx.quadraticCurveTo(cpx, cpy, endX, endY);
        }
        const last = ribbon.points[ribbon.points.length - 1];
        offCtx.lineTo(last.renderX * scaleX, last.renderY * scaleY);

        // Pass 1: Wide diffuse glow halo
        offCtx.filter = `blur(${isMobile ? 15 : 25}px)`;
        offCtx.strokeStyle = tc.halo(ribbon.opacity * silkIntensity * 0.5);
        offCtx.lineWidth = ribbon.width * scaleX * 2.5;
        offCtx.lineCap = 'round';
        offCtx.lineJoin = 'round';
        offCtx.stroke();

        // Pass 2: Main ribbon body
        offCtx.filter = `blur(${isMobile ? 6 : 10}px)`;
        offCtx.strokeStyle = tc.body(ribbon.opacity * silkIntensity);
        offCtx.lineWidth = ribbon.width * scaleX;
        offCtx.stroke();

        // Pass 3: Bright inner core
        offCtx.filter = `blur(${isMobile ? 2 : 4}px)`;
        offCtx.strokeStyle = tc.core(ribbon.opacity * silkIntensity * 0.6);
        offCtx.lineWidth = ribbon.width * scaleX * 0.3;
        offCtx.stroke();
      }
      offCtx.restore();

      // --- Composite to visible canvas ---
      ctx!.clearRect(0, 0, w, h);
      ctx!.drawImage(offscreen, 0, 0, offW, offH, 0, 0, w, h);

      time++;
      animationId = requestAnimationFrame(draw);
    }

    // Intersection Observer — pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0 }
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
          opacity: tc.opacity * 0.625,
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
