import React, { useMemo } from "react";
import "./hud.css";

import { ICONS, COLORS, ORBITS, C } from "./constants.js";
import { useItems } from "./hooks/useItems.js";
import { useClock } from "./hooks/useClock.js";
import { useFlyTo } from "./hooks/useFlyTo.js";

import Starfield from "./components/Starfield.jsx";
import TopBar from "./components/TopBar.jsx";
import Galaxy from "./components/Galaxy.jsx";
import ModuleDetail from "./components/ModuleDetail.jsx";

// turns a raw db item into a planet with a position, icon and color
function toPlanet(item, i, total) {
  const angle = (2 * Math.PI * i) / Math.max(total, 1) + Math.PI / 6;
  const orbitR = ORBITS[i % ORBITS.length];
  return {
    id: item.id,
    name: (item.description || `ITEM ${item.id}`).toUpperCase(),
    icon: ICONS[i % ICONS.length],
    color: COLORS[i % COLORS.length],
    x: C + orbitR * Math.cos(angle),
    y: C + orbitR * Math.sin(angle) * 0.55,
    size: 10 + (i % 4) * 2,
    price: item.price,
    quantity: item.quantity,
  };
}

export default function GalaxyHUD() {
  const { items, status } = useItems();
  const clock = useClock();

  const planets = useMemo(
    () => items.map((item, i) => toPlanet(item, i, items.length)),
    [items]
  );

  const { hovered, setHovered, zoomedIndex, zoomOrigin, detailVisible, activeModule, flyTo, backToMap } =
    useFlyTo(planets);

  return (
    <div
      style={{
        position: "relative", width: "100%", minHeight: 640,
        background: "radial-gradient(ellipse at 50% 40%,#0a0a1c 0%,#08081a 45%,#020208 100%)",
        color: "#eafcff", fontFamily: "'Rajdhani', sans-serif",
        overflow: "hidden", borderRadius: 12,
      }}
    >
      <Starfield />
      <TopBar status={status} planetCount={planets.length} clock={clock} />

      {status === "error" && (
        <div className="g-label" style={{ position: "relative", zIndex: 3, textAlign: "center", marginTop: 120, color: "#ff6b6b", fontSize: 12 }}>
          COULD NOT REACH THE BACKEND — CHECK THE SERVER IS RUNNING AND CORS IS ENABLED
        </div>
      )}

      {status === "ok" && (
        <Galaxy
          planets={planets}
          hovered={hovered}
          setHovered={setHovered}
          zoomedIndex={zoomedIndex}
          zoomOrigin={zoomOrigin}
          flyTo={flyTo}
        />
      )}

      <ModuleDetail module={activeModule} visible={detailVisible} onBack={backToMap} />
    </div>
  );
}
