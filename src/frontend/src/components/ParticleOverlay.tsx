import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 18;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export function ParticleOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const el = document.createElement("div");
      el.className = "particle";
      const size = randomBetween(1.5, 4);
      const styles = [
        `width: ${size}px`,
        `height: ${size}px`,
        `left: ${randomBetween(5, 95)}%`,
        `bottom: ${randomBetween(-10, 20)}%`,
        `animation-duration: ${randomBetween(5, 14)}s`,
        `animation-delay: ${randomBetween(0, 8)}s`,
        "opacity: 0",
      ];
      el.style.cssText = styles.join(";");
      container.appendChild(el);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
