import React from "react";
import { C } from "../constants.js";

export default function Planet({ planet, isHot, onHoverStart, onHoverEnd, onSelect }) {
  const Icon = planet.icon;

  return (
    <g
      className="g-hit"
      style={{ cursor: "pointer" }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onSelect}
    >
      <line
        x1={C} y1={C} x2={planet.x} y2={planet.y}
        stroke={isHot ? planet.color : "#4ce7ff"}
        strokeWidth={isHot ? 1.4 : 1}
        opacity={isHot ? 0.7 : 0.25}
      />
      <circle
        className="g-planet-halo"
        cx={planet.x} cy={planet.y}
        r={isHot ? planet.size + 10 : planet.size + 6}
        fill="none" stroke={planet.color} strokeWidth="1"
      />
      <circle
        cx={planet.x} cy={planet.y}
        r={isHot ? planet.size + 2 : planet.size}
        fill={planet.color}
        style={{ filter: `drop-shadow(0 0 10px ${planet.color})`, transition: "r .2s ease" }}
      />
      {isHot && <circle className="g-ping" cx={planet.x} cy={planet.y} r="8" fill="none" stroke={planet.color} strokeWidth="1.4" />}

      <foreignObject x={planet.x - 70} y={planet.y + planet.size + 14} width="140" height="40">
        <div style={{ textAlign: "center" }}>
          <div className="g-label" style={{ fontSize: 10, color: isHot ? planet.color : "#4ce7ff", opacity: isHot ? 1 : 0.8 }}>
            {planet.name}
          </div>
          <div className="g-hint g-label" style={{ fontSize: 8, color: planet.color, marginTop: 2 }}>
            CLICK TO TRAVEL
          </div>
        </div>
      </foreignObject>
    </g>
  );
}
