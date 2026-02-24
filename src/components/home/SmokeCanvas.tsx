import { useEffect, useRef, useState } from 'react';

interface SmokeParticle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
  noiseOffset: number;
}

interface SmokeThemeColors {
  main: (o: number) => [string, string, string];
  wisp: (o: number) => [string, string];
  reducedBg: string;
}

const smokeThemes: Record<string, SmokeThemeColors> = {
  dark: {
    main: (o) => [
      `rgba(16, 19, 28, ${o})`,
      `rgba(10, 19, 28, ${o * 0.6})`,
      'rgba(4, 7, 13, 0)',
    ],
    wisp: (o) => [
      `rgba(64, 120, 168, ${o * 0.3})`,
      'rgba(4, 7, 13, 0)',
    ],
    reducedBg: 'radial-gradient(ellipse at 30% 50%, #10131C 0%, #04070D 60%), radial-gradient(ellipse at 70% 30%, #0D0F17 0%, #04070D 50%)',
  },
  light: {
    main: (o) => [
      `rgba(200, 190, 220, ${o})`,
      `rgba(180, 170, 210, ${o * 0.6})`,
      'rgba(255, 255, 255, 0)',
    ],
    wisp: (o) => [
      `rgba(100, 80, 160, ${o * 0.3})`,
      'rgba(255, 255, 255, 0)',
    ],
    reducedBg: 'radial-gradient(ellipse at 30% 50%, #F0EBF7 0%, #FFFFFF 60%), radial-gradient(ellipse at 70% 30%, #EDE8F5 0%, #FFFFFF 50%)',
  },
};

function getTheme(): string {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function createParticle(width: number, height: number): SmokeParticle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 80 + Math.random() * 150,
    opacity: 0.015 + Math.random() * 0.04,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.15,
    noiseOffset: Math.random() * Math.PI * 2,
  };
}

export default function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tc = smokeThemes[theme] || smokeThemes.dark;

    let animationId: number;
    let particles: SmokeParticle[] = [];
    let time = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);

      const isMobile = rect.width < 768;
      const count = isMobile ? 30 : 55;
      particles = Array.from({ length: count }, () =>
        createParticle(rect.width, rect.height)
      );
    }

    function draw() {
      const rect = canvas!.getBoundingClientRect();
      ctx!.clearRect(0, 0, rect.width, rect.height);

      // Apply blur for soft fog effect
      ctx!.filter = 'blur(50px)';

      for (const p of particles) {
        // Update position with sine wave perturbation
        p.x += p.vx + Math.sin(time * 0.001 + p.noiseOffset) * 0.2;
        p.y += p.vy + Math.cos(time * 0.0008 + p.noiseOffset) * 0.15;

        // Wrap around edges
        if (p.x < -p.radius) p.x = rect.width + p.radius;
        if (p.x > rect.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = rect.height + p.radius;
        if (p.y > rect.height + p.radius) p.y = -p.radius;

        // Draw particle — theme-aware
        const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        const [m0, m1, m2] = tc.main(p.opacity);
        gradient.addColorStop(0, m0);
        gradient.addColorStop(0.5, m1);
        gradient.addColorStop(1, m2);

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Add a few lighter wisps with theme-aware tint
      ctx!.filter = 'blur(80px)';
      for (let i = 0; i < 5; i++) {
        const p = particles[i];
        if (!p) continue;
        const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 0.8);
        const [w0, w1] = tc.wisp(p.opacity);
        gradient.addColorStop(0, w0);
        gradient.addColorStop(1, w1);
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.filter = 'none';
      time++;
      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [prefersReducedMotion, theme]);

  const tc = smokeThemes[theme] || smokeThemes.dark;

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: tc.reducedBg,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
}
