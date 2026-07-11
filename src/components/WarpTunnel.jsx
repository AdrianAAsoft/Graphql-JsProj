import React, { useMemo } from "react";

// full-screen radial star streaks shown while flying into a world
export default function WarpTunnel() {
  const streaks = useMemo(
    () =>
      Array.from({ length: 70 }).map(() => {
        const angle = Math.random() * 2 * Math.PI;
        const r0 = 4 + Math.random() * 18;     // where the streak starts (from center)
        const len = 6 + Math.random() * 26;    // how far it stretches
        return {
          x1: 50 + r0 * Math.cos(angle),
          y1: 50 + r0 * Math.sin(angle),
          x2: 50 + (r0 + len) * Math.cos(angle),
          y2: 50 + (r0 + len) * Math.sin(angle),
          width: 0.12 + Math.random() * 0.25,
          delay: Math.random() * 0.18,
          cyan: Math.random() < 0.35,
        };
      }),
    []
  );

  return (
    <div className="j-warp" style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
        <g className="j-warp-burst" style={{ transformOrigin: "50px 50px" }}>
          {streaks.map((s, i) => (
            <line
              key={i}
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={s.cyan ? "#4ce7ff" : "#eafcff"}
              strokeWidth={s.width}
              strokeLinecap="round"
              className="j-warp-line"
              style={{ animationDelay: `${s.delay}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
