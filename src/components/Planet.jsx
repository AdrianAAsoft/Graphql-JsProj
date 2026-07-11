import React from "react";
import { C } from "../constants.js";

// four corner brackets of a target-lock box
function LockBrackets({ x, y, r, color }) {
  const o = r + 14; // offset from center
  const L = 9; // bracket arm length
  const corners = [
    [x - o, y - o, L, L],
    [x + o, y - o, -L, L],
    [x + o, y + o, -L, -L],
    [x - o, y + o, L, -L],
  ];
  return (
    <g>
      {corners.map(([cx, cy, dx, dy], i) => (
        <path key={i} d={`M ${cx + dx} ${cy} L ${cx} ${cy} L ${cx} ${cy + dy}`} fill="none" stroke={color} strokeWidth="1.6" />
      ))}
    </g>
  );
}

export default function Planet({ planet, isHot, onHoverStart, onHoverEnd, onSelect }) {
  const { x, y, size, color, id } = planet;
  const sphereId = `j-sphere-${id}`;
  const atmoId = `j-atmo-${id}`;

  // arc gauge: fraction of a ring showing how much data lives in this world
  const gaugeR = size + 12;
  const gaugeFrac = planet.count != null ? Math.min(planet.count / 12, 1) : null;
  const gaugeCirc = 2 * Math.PI * gaugeR;

  // moon position, driven by the shared orbit clock
  const moonR = size + 10;
  const mx = planet.moonAngle != null ? x + moonR * Math.cos(planet.moonAngle) : null;
  const my = planet.moonAngle != null ? y + moonR * Math.sin(planet.moonAngle) * 0.5 : null;
  const moonBehind = planet.moonAngle != null && Math.sin(planet.moonAngle) < 0;

  return (
    <g
      className="g-hit"
      style={{ cursor: "pointer" }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onSelect}
    >
      <defs>
        <radialGradient id={sphereId} cx="35%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="28%" stopColor={color} />
          <stop offset="78%" stopColor={color} stopOpacity="0.75" />
          <stop offset="100%" stopColor="#020208" />
        </radialGradient>
        <radialGradient id={atmoId} cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor={color} stopOpacity="0" />
          <stop offset="82%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* tether to the core */}
      <line
        x1={C} y1={C} x2={x} y2={y}
        stroke={isHot ? color : "#4ce7ff"}
        strokeWidth={isHot ? 1.4 : 1}
        opacity={isHot ? 0.7 : 0.22}
      />

      {/* moon passing behind the planet */}
      {moonBehind && mx != null && <circle cx={mx} cy={my} r={2.6} fill="#9fb8c9" opacity="0.8" />}

      {/* back half of the ring system */}
      {planet.rings && (
        <ellipse cx={x} cy={y} rx={size * 2.1} ry={size * 0.62} fill="none" stroke={color} strokeWidth="1.4" opacity="0.5" transform={`rotate(-16 ${x} ${y})`} />
      )}

      {/* atmosphere halo */}
      <circle cx={x} cy={y} r={size + 9} fill={`url(#${atmoId})`} />

      {/* the globe itself */}
      <circle
        cx={x} cy={y}
        r={isHot ? size + 1.5 : size}
        fill={`url(#${sphereId})`}
        style={{ filter: `drop-shadow(0 0 ${isHot ? 16 : 9}px ${color})`, transition: "r .2s ease" }}
      />

      {/* front arc of the ring system, drawn over the globe */}
      {planet.rings && (
        <path
          d={`M ${x - size * 2.1} ${y} A ${size * 2.1} ${size * 0.62} 0 0 0 ${x + size * 2.1} ${y}`}
          fill="none" stroke={color} strokeWidth="1.6" opacity="0.85"
          transform={`rotate(-16 ${x} ${y})`}
        />
      )}

      {/* moon passing in front */}
      {!moonBehind && mx != null && <circle cx={mx} cy={my} r={2.6} fill="#cfe3ee" />}

      {/* data gauge arc: how full this world is */}
      {gaugeFrac != null && (
        <>
          <circle cx={x} cy={y} r={gaugeR} fill="none" stroke={color} strokeWidth="1" opacity="0.15" />
          <circle
            cx={x} cy={y} r={gaugeR} fill="none" stroke={color} strokeWidth="2"
            strokeDasharray={`${gaugeCirc * gaugeFrac} ${gaugeCirc}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${x} ${y})`}
            opacity="0.85"
          />
        </>
      )}

      {/* target lock on hover */}
      {isHot && (
        <>
          <LockBrackets x={x} y={y} r={gaugeR} color={color} />
          <g className="j-spin-fast" style={{ transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r={gaugeR + 7} fill="none" stroke={color} strokeWidth="1" strokeDasharray="14 10" opacity="0.7" />
          </g>
          <circle className="g-ping" cx={x} cy={y} r="8" fill="none" stroke={color} strokeWidth="1.4" />
        </>
      )}

      {/* nameplate + telemetry */}
      <foreignObject x={x - 80} y={y + gaugeR + 12} width="160" height="56">
        <div style={{ textAlign: "center" }}>
          <div className="g-label" style={{ fontSize: 10, color: isHot ? color : "#4ce7ff", opacity: isHot ? 1 : 0.85 }}>
            {planet.name}
          </div>
          {planet.count != null && (
            <div className="g-label" style={{ fontSize: 8, color: "#7fb8c9", marginTop: 2 }}>
              RECORDS: {planet.count}
            </div>
          )}
          <div className="g-hint g-label" style={{ fontSize: 8, color, marginTop: 2 }}>
            ▸ ENGAGE
          </div>
        </div>
      </foreignObject>
    </g>
  );
}
