import React, { useState } from "react";
import Starfield from "./Starfield.jsx";

const BOOT_LINES = [
  "> INITIALIZING J.A.R.V.I.S CORE .............. OK",
  "> LOADING NEURAL INTERFACE ................... OK",
  "> CALIBRATING HOLOGRAPHIC PROJECTORS ......... OK",
  "> LINKING ORBITAL MODULES .................... OK",
  "> UPLINK TO GRAPHQL CORE ..................... OK",
  "> WELCOME BACK, COMMANDER.",
];

function ReactorRing() {
  return (
    <svg viewBox="0 0 220 220" style={{ width: 190, height: 190, display: "block", margin: "0 auto" }}>
      <g className="j-ring" style={{ transformBox: "fill-box" }}>
        <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(76,231,255,.35)" strokeWidth="1.5" strokeDasharray="40 14 8 14" />
      </g>
      <g className="j-ring-rev" style={{ transformBox: "fill-box" }}>
        <circle cx="110" cy="110" r="78" fill="none" stroke="rgba(76,231,255,.55)" strokeWidth="1" strokeDasharray="4 10" />
      </g>
      <g className="j-ring" style={{ transformBox: "fill-box" }}>
        <circle cx="110" cy="110" r="60" fill="none" stroke="rgba(125,255,176,.35)" strokeWidth="1.5" strokeDasharray="90 30" />
      </g>
      {[...Array(10)].map((_, i) => {
        const a = (i / 10) * 2 * Math.PI;
        return (
          <rect
            key={i}
            x={110 + 44 * Math.cos(a) - 3} y={110 + 44 * Math.sin(a) - 8}
            width="6" height="16" rx="2"
            fill="rgba(76,231,255,.8)"
            transform={`rotate(${(a * 180) / Math.PI + 90} ${110 + 44 * Math.cos(a)} ${110 + 44 * Math.sin(a)})`}
          />
        );
      })}
      <circle className="j-reactor" cx="110" cy="110" r="22" fill="#4ce7ff" opacity="0.95" />
      <circle cx="110" cy="110" r="30" fill="none" stroke="#4ce7ff" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

export default function LoginScreen({ onLogin }) {
  const [callsign, setCallsign] = useState("");
  const [passkey, setPasskey] = useState("");
  const [phase, setPhase] = useState("login"); // login | boot
  const [bootStep, setBootStep] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPhase("boot");
    // reveal boot lines one by one, then enter
    BOOT_LINES.forEach((_, i) => {
      setTimeout(() => setBootStep(i + 1), 450 * (i + 1));
    });
    setTimeout(() => onLogin(callsign.trim() || "COMMANDER"), 450 * (BOOT_LINES.length + 1) + 400);
  };

  return (
    <div
      className="j-scene"
      style={{
        position: "relative", width: "100vw", height: "100vh", overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 40%,#0a0a1c 0%,#08081a 45%,#020208 100%)",
        color: "#eafcff", fontFamily: "'Rajdhani', sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <Starfield />
      <div className="j-scanline" />
      <div className="j-crt" />

      {phase === "login" && (
        <div className="j-panel" style={{ position: "relative", zIndex: 3, width: 380, padding: "34px 38px 30px" }}>
          <ReactorRing />
          <div className="j-flicker" style={{ textAlign: "center", marginTop: 14, fontWeight: 700, fontSize: 22, letterSpacing: 6 }}>
            J.A.R.V.I.S
          </div>
          <div className="g-label" style={{ textAlign: "center", fontSize: 9, color: "#2e8fa8", marginBottom: 24, letterSpacing: 3 }}>
            ORBITAL SYSTEMS INTERFACE // v2.0
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input className="j-input" placeholder="CALLSIGN" value={callsign} onChange={(e) => setCallsign(e.target.value)} autoFocus />
            <input className="j-input" type="password" placeholder="PASSKEY" value={passkey} onChange={(e) => setPasskey(e.target.value)} />
            <button className="j-btn" type="submit">AUTHENTICATE</button>
          </form>

          <div className="g-label" style={{ marginTop: 18, fontSize: 9, color: "#1c5b6e", textAlign: "center" }}>
            BIOMETRIC BYPASS ACTIVE <span className="j-blink">▊</span>
          </div>
        </div>
      )}

      {phase === "boot" && (
        <div style={{ position: "relative", zIndex: 3, width: 520 }}>
          <ReactorRing />
          <div className="g-label" style={{ marginTop: 26, fontSize: 12, color: "#4ce7ff", lineHeight: 2.1 }}>
            {BOOT_LINES.slice(0, bootStep).map((line, i) => (
              <div key={i} className="j-boot-line" style={{ color: i === BOOT_LINES.length - 1 ? "#7dffb0" : "#4ce7ff" }}>
                {line}
              </div>
            ))}
            <span className="j-blink">▊</span>
          </div>
        </div>
      )}
    </div>
  );
}
