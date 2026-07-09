import React from "react";

export default function TopBar({ status, planetCount, clock, onAddClick }) {
  const statusLine =
    status === "loading" ? "SYNCING WITH CORE..." :
    status === "error" ? "UPLINK FAILED" :
    `${planetCount} MODULES IN ORBIT`;

  const onlineLine =
    status === "ok" ? "SYSTEM ONLINE" :
    status === "loading" ? "CONNECTING" :
    "OFFLINE";

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 28px 0 28px", position: "relative", zIndex: 3 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", border: "2px solid #4ce7ff", boxShadow: "0 0 10px rgba(76,231,255,.4)" }} />
        <div>
          <div style={{ fontWeight: 700, letterSpacing: 3, fontSize: 15 }}>GALAXY // SYSTEM MAP</div>
          <div className="g-label" style={{ fontSize: 9, color: "#1c5b6e" }}>{statusLine}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <button
          className="g-label"
          onClick={onAddClick}
          style={{
            background: "transparent", color: "#4ce7ff", border: "1px solid rgba(76,231,255,.3)",
            padding: "8px 14px", fontSize: 11, letterSpacing: 1.5, cursor: "pointer",
          }}
        >
          + ADD MODULE
        </button>
        <div className="g-label" style={{ fontSize: 11, color: "#4ce7ff", textAlign: "right" }}>
          <div>● {onlineLine}</div>
          <div style={{ color: "#eafcff" }}>{clock}</div>
        </div>
      </div>
    </div>
  );
}
