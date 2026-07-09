import React, { useMemo } from "react";

export default function Starfield({ count = 280 }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map(() => {
        const layer = Math.random();
        const size =
          layer < 0.7 ? Math.random() * 1.1 + 0.4 :
          layer < 0.93 ? Math.random() * 1.6 + 1.2 :
          Math.random() * 2.2 + 2;
        return {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size,
          delay: Math.random() * 5,
          glow: layer >= 0.93,
        };
      }),
    [count]
  );

  return (
    <>
      <div
        style={{
          position: "absolute", inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 30% 25%, rgba(120,80,255,.10), transparent 70%), " +
            "radial-gradient(ellipse 50% 35% at 75% 70%, rgba(76,231,255,.08), transparent 70%)",
        }}
      />
      {stars.map((s, i) => (
        <div
          key={i}
          className="g-star"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            animationDelay: `${s.delay}s`,
            boxShadow: s.glow ? `0 0 ${s.size * 3}px ${s.size}px rgba(200,220,255,.5)` : "none",
          }}
        />
      ))}
    </>
  );
}
