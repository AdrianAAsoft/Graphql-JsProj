import React, { useMemo } from "react";
import { ORBITS, VB, C } from "../constants.js";
import Planet from "./Planet.jsx";

const SQUASH = 0.55; // vertical flattening shared by everything in orbit

// tick marks + degree labels around the outer navigation ring
function OuterRing() {
  const R = 340;
  const ticks = [];
  for (let d = 0; d < 360; d += 5) {
    const a = (d * Math.PI) / 180;
    const major = d % 30 === 0;
    const r1 = R - (major ? 10 : 5);
    ticks.push(
      <line
        key={d}
        x1={C + r1 * Math.cos(a)} y1={C + r1 * SQUASH * Math.sin(a)}
        x2={C + R * Math.cos(a)} y2={C + R * SQUASH * Math.sin(a)}
        stroke="rgba(76,231,255,.35)" strokeWidth={major ? 1.2 : 0.6}
      />
    );
    if (major) {
      ticks.push(
        <text
          key={`t${d}`}
          x={C + (R + 14) * Math.cos(a)} y={C + (R + 14) * SQUASH * Math.sin(a)}
          fill="rgba(76,231,255,.4)" fontSize="9" textAnchor="middle" dominantBaseline="middle"
          fontFamily="'JetBrains Mono', monospace"
        >
          {String(d).padStart(3, "0")}
        </text>
      );
    }
  }
  return (
    <g>
      <ellipse cx={C} cy={C} rx={R} ry={R * SQUASH} fill="none" stroke="rgba(76,231,255,.18)" />
      {ticks}
    </g>
  );
}

// a drifting ring of debris between the middle and outer orbits
function AsteroidBelt({ t }) {
  const rocks = useMemo(
    () =>
      Array.from({ length: 90 }).map(() => ({
        angle: Math.random() * 2 * Math.PI,
        r: 282 + (Math.random() - 0.5) * 26,
        size: Math.random() * 1.4 + 0.5,
        speed: 0.02 + Math.random() * 0.03,
        opacity: 0.25 + Math.random() * 0.45,
      })),
    []
  );
  return (
    <g>
      {rocks.map((k, i) => {
        const a = k.angle + t * k.speed;
        return (
          <circle
            key={i}
            cx={C + k.r * Math.cos(a)}
            cy={C + k.r * SQUASH * Math.sin(a)}
            r={k.size}
            fill="#9fc4d4"
            opacity={k.opacity}
          />
        );
      })}
    </g>
  );
}

export default function Galaxy({ planets, hovered, setHovered, zoomedIndex, zoomOrigin, flyTo, t = 0 }) {
  return (
    <div
      className={`g-wrap${zoomedIndex !== null ? " zoom" : ""}`}
      style={{ transformOrigin: zoomOrigin, pointerEvents: zoomedIndex !== null ? "none" : "auto" }}
    >
      <svg viewBox={`0 0 ${VB} ${VB}`} style={{ width: "100%", height: "calc(100vh - 90px)", display: "block" }}>
        {ORBITS.map((r, i) => (
          <ellipse key={i} cx={C} cy={C} rx={r} ry={r * SQUASH} fill="none" stroke="rgba(76,231,255,.15)" strokeDasharray="2 8" />
        ))}

        <OuterRing />
        <AsteroidBelt t={t} />

        {/* rotating holographic ring assembly around the core */}
        <g className="j-spin-slow">
          <circle cx={C} cy={C} r={62} fill="none" stroke="rgba(76,231,255,.3)" strokeWidth="1" strokeDasharray="60 22 10 22" />
        </g>
        <g className="j-spin-rev">
          <circle cx={C} cy={C} r={48} fill="none" stroke="rgba(76,231,255,.45)" strokeWidth="1" strokeDasharray="5 12" />
        </g>
        <g className="j-spin-med">
          <circle cx={C} cy={C} r={80} fill="none" stroke="rgba(125,255,176,.18)" strokeWidth="1.5" strokeDasharray="120 60" />
        </g>

        <circle className="g-core" cx={C} cy={C} r="16" fill="#4ce7ff" style={{ filter: "drop-shadow(0 0 18px #4ce7ff)" }} />
        <circle cx={C} cy={C} r="26" fill="none" stroke="#4ce7ff" strokeWidth="1" opacity="0.4" />

        {planets.map((p, i) => (
          <Planet
            key={p.id}
            planet={p}
            isHot={hovered === i}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            onSelect={() => flyTo(i)}
          />
        ))}
      </svg>
    </div>
  );
}
