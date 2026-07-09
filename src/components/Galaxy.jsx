import React from "react";
import { ORBITS, VB, C } from "../constants.js";
import Planet from "./Planet.jsx";

export default function Galaxy({ planets, hovered, setHovered, zoomedIndex, zoomOrigin, flyTo }) {
  return (
    <div
      className={`g-wrap${zoomedIndex !== null ? " zoom" : ""}`}
      style={{ transformOrigin: zoomOrigin, pointerEvents: zoomedIndex !== null ? "none" : "auto" }}
    >
      <svg viewBox={`0 0 ${VB} ${VB}`} style={{ width: "100%", height: 560, display: "block" }}>
        {ORBITS.map((r, i) => (
          <ellipse key={i} cx={C} cy={C} rx={r} ry={r * 0.55} fill="none" stroke="rgba(76,231,255,.15)" strokeDasharray="2 8" />
        ))}
        <circle cx={C} cy={C} r={340} fill="none" stroke="rgba(76,231,255,.06)" />

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
