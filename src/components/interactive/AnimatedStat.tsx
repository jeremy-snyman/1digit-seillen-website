import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  suffix?: string;
  label: string;
  description: string;
}

export default function AnimatedStat({ value, suffix = '', label, description }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayed(value);
      return;
    }

    // Parse the numeric part — handles ranges like "7–10" and plain numbers like "35"
    const numericMatch = value.match(/(\d+)$/);
    if (!numericMatch) {
      setDisplayed(value);
      return;
    }

    const targetNum = parseInt(numericMatch[1], 10);
    const prefix = value.slice(0, value.length - numericMatch[1].length);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const duration = 1500;
          const startTime = performance.now();

          function easeOutExpo(t: number): number {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          }

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(progress);
            const current = Math.round(eased * targetNum);
            setDisplayed(`${prefix}${current}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayed(value);
            }
          }

          setDisplayed(`${prefix}0`);
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-display-lg lg:text-display-xl font-display text-glow-blue mb-2">
        {displayed}
        {suffix && <span>{suffix}</span>}
      </div>
      <div className="text-heading-xs font-semibold mb-2">{label}</div>
      <p className="text-body-sm text-content-secondary">{description}</p>
    </div>
  );
}
