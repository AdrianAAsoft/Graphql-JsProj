import React, { useCallback, useEffect, useRef, useState } from "react";
import "./hud.css";

import { ORBITS, COLORS, C } from "./constants.js";
import { useItems } from "./hooks/useItems.js";
import { useUsers } from "./hooks/useUsers.js";
import { useClock } from "./hooks/useClock.js";
import { useFlyTo } from "./hooks/useFlyTo.js";
import { useOrbitTime } from "./hooks/useOrbitTime.js";
import { useLogs } from "./hooks/useLogs.js";
import { subscribe, ITEM_CREATED_SUB, USER_UPDATED_SUB } from "./api/subscriptions.js";

import Starfield from "./components/Starfield.jsx";
import TopBar from "./components/TopBar.jsx";
import Galaxy from "./components/Galaxy.jsx";
import SectionPanel from "./components/SectionPanel.jsx";
import WarpTunnel from "./components/WarpTunnel.jsx";

// the worlds you can travel to — each one is a section of the app.
// to add a new world: add a line here and register its panel in SectionPanel.jsx.
// orbit, angle, speed, size and color are all derived from the index automatically.
const SECTIONS = [
  { section: "items", name: "CARGO // ITEMS", rings: true },
  { section: "users", name: "CREW // USERS", moon: true },
  { section: "system", name: "CORE // SYSTEM" },
  { section: "log", name: "LOG // EVENTS" },
];

const GOLDEN_ANGLE = 2.39996; // spreads any number of worlds evenly around the map

function toWorld(s, i, counts, t) {
  const r = ORBITS[i % ORBITS.length];
  const angle = i * GOLDEN_ANGLE + (0.05 + (i % 3) * 0.045) * t;
  return {
    id: s.section,
    section: s.section,
    name: s.name,
    color: COLORS[i % COLORS.length],
    x: C + r * Math.cos(angle),
    y: C + r * Math.sin(angle) * 0.55,
    size: 16 - (i % 3) * 2,
    count: counts[s.section] ?? null,
    rings: s.rings,
    moonAngle: s.moon ? t * 0.9 : null,
  };
}

export default function GalaxyHUD({ operator = "COMMANDER", onLogout }) {
  const { items, status: itemsStatus, refetch: refetchItems } = useItems();
  const { users, status: usersStatus, refetch: refetchUsers } = useUsers();
  const clock = useClock();

  // persistent event log (DB-backed), shown in the LOG world
  const { logs, writeLog } = useLogs();

  // shared clock for orbital motion; freezes while aiming at a world or zoomed in
  const orbitPausedRef = useRef(false);
  const t = useOrbitTime(orbitPausedRef);

  const counts = { items: items.length, users: users.length, log: logs.length };
  const worlds = SECTIONS.map((s, i) => toWorld(s, i, counts, t));

  const { hovered, setHovered, zoomedIndex, zoomOrigin, detailVisible, activeModule, flyTo, jumpTo, backToMap } =
    useFlyTo(worlds);

  orbitPausedRef.current = hovered !== null || zoomedIndex !== null;

  // warp streaks while the fly-to zoom is playing
  const [warping, setWarping] = useState(false);
  const engageWarp = (i) => {
    if (zoomedIndex !== null) return;
    setWarping(true);
    setTimeout(() => setWarping(false), 800);
    flyTo(i);
  };

  useEffect(() => {
    writeLog(`UPLINK ESTABLISHED // OPERATOR ${operator}`);
  }, [writeLog, operator]);

  useEffect(() => {
    if (itemsStatus === "ok") writeLog(`CARGO MANIFEST SYNCED // ${items.length} ITEMS`);
  }, [itemsStatus, items.length, writeLog]);

  useEffect(() => {
    if (usersStatus === "ok") writeLog(`CREW ROSTER SYNCED // ${users.length} PERSONNEL`);
  }, [usersStatus, users.length, writeLog]);

  const activeSection = activeModule?.section;
  useEffect(() => {
    if (activeSection) writeLog(`ENGAGED SECTOR // ${activeSection.toUpperCase()}`);
  }, [activeSection, writeLog]);

  // live feed: react to changes made by anyone, not just this browser
  const [toast, setToast] = useState(null);
  const announce = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast((cur) => (cur === msg ? null : cur)), 4000);
  }, []);

  useEffect(() => {
    const offItem = subscribe(ITEM_CREATED_SUB, (d) => {
      const it = d.itemCreated;
      if (!it) return;
      writeLog(`INCOMING TRANSMISSION // ITEM "${(it.description || "").toUpperCase()}" DEPLOYED`);
      announce(`INCOMING TRANSMISSION // NEW CARGO: ${(it.description || "").toUpperCase()}`);
      refetchItems();
    });
    const offUser = subscribe(USER_UPDATED_SUB, (d) => {
      const u = d.usrUpdated;
      if (!u) return;
      writeLog(`INCOMING TRANSMISSION // CREW RECORD "${(u.name || "").toUpperCase()}" UPDATED`);
      announce(`INCOMING TRANSMISSION // CREW UPDATE: ${(u.name || "").toUpperCase()}`);
      refetchUsers();
    });
    return () => {
      offItem();
      offUser();
    };
  }, [writeLog, announce, refetchItems, refetchUsers]);

  // iron-man style parallax: the hologram tilts toward your cursor
  const frameRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 .. 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: nx, y: ny });
  };

  const status = itemsStatus === "error" && usersStatus === "error" ? "error" : itemsStatus;

  return (
    <div
      ref={frameRef}
      className="j-scene"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        position: "relative", width: "100vw", height: "100vh",
        background: "radial-gradient(ellipse at 50% 40%,#0a0a1c 0%,#08081a 45%,#020208 100%)",
        color: "#eafcff", fontFamily: "'Rajdhani', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* far star layer drifts opposite the cursor */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${tilt.x * -18}px, ${tilt.y * -18}px)`, transition: "transform .25s ease-out" }}>
        <Starfield />
      </div>

      <div className="j-scanline" />
      <div className="j-crt" />

      <TopBar status={status} planetCount={worlds.length} clock={clock} operator={operator} onLogout={onLogout} />

      {toast && (
        <div
          className="j-panel g-label j-row-in"
          style={{
            position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)",
            zIndex: 7, padding: "10px 22px", fontSize: 11, color: "#7dffb0", letterSpacing: 2,
          }}
        >
          ▲ {toast}
        </div>
      )}

      {status === "error" && (
        <div className="g-label" style={{ position: "relative", zIndex: 3, textAlign: "center", marginTop: 120, color: "#ff6b6b", fontSize: 12 }}>
          COULD NOT REACH THE BACKEND — CHECK THE SERVER IS RUNNING AND CORS IS ENABLED
        </div>
      )}

      {status !== "error" && (
        <div style={{ perspective: 1100, position: "relative", zIndex: 2 }}>
          <div
            style={{
              transform: `rotateY(${tilt.x * 14}deg) rotateX(${tilt.y * -12}deg)`,
              transition: "transform .25s ease-out",
              transformStyle: "preserve-3d",
            }}
          >
            <Galaxy
              planets={worlds}
              hovered={hovered}
              setHovered={setHovered}
              zoomedIndex={zoomedIndex}
              zoomOrigin={zoomOrigin}
              flyTo={engageWarp}
              t={t}
            />
          </div>
        </div>
      )}

      {warping && <WarpTunnel />}

      <SectionPanel
        section={activeModule?.section}
        visible={detailVisible}
        onBack={backToMap}
        onNavigate={jumpTo}
        worlds={worlds}
        items={items}
        users={users}
        itemsStatus={itemsStatus}
        usersStatus={usersStatus}
        refetchItems={refetchItems}
        refetchUsers={refetchUsers}
        operator={operator}
        events={logs}
      />
    </div>
  );
}
