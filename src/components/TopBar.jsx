import React from "react";

export default function TopBar({ status, planetCount, clock, operator }) {
  const statusLine =
    status === "loading" ? "SYNCING WITH CORE..." :
    status === "error" ? "UPLINK FAILED" :
    `${planetCount} SECTORS IN ORBIT // OPERATOR: ${operator}`;

  const onlineLine =
    status === "ok" ? "SYSTEM ONLINE" :
    status === "loading" ? "CONNECTING" :
    "OFFLINE";

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 28px 0 28px", position: "relative", zIndex: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", border: "2px solid #4ce7ff", boxShadow: "0 0 10px rgba(76,231,255,.4)" }} />
        <div>
          <div className="j-flicker" style={{ fontWeight: 700, letterSpacing: 3, fontSize: 15 }}>J.A.R.V.I.S // MODULES IN ORBIT</div>
          <div className="g-label" style={{ fontSize: 9, color: "#1c5b6e" }}>{statusLine}</div>
        </div>
      </div>
      <div className="g-label" style={{ fontSize: 11, color: "#4ce7ff", textAlign: "right" }}>
        <div>● {onlineLine}</div>
        <div style={{ color: "#eafcff" }}>{clock}</div>
      </div>
    </div>
  );
}
