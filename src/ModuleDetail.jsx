import React from "react";
import { ArrowLeft } from "lucide-react";

export default function ModuleDetail({ module, visible, onBack }) {
  return (
    <div
      className={`g-overlay${visible ? " visible" : ""}`}
      style={{ background: "radial-gradient(ellipse at 50% 40%,#0a0a1c 0%,#08081a 45%,#020208 100%)" }}
    >
      {module && (
        <div style={{ padding: "8px 28px 28px 28px" }}>
          <button
            className="g-back g-label"
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "transparent", color: "#4ce7ff",
              border: "1px solid rgba(76,231,255,.3)",
              padding: "8px 14px", fontSize: 11, letterSpacing: 1.5,
              cursor: "pointer", marginBottom: 18,
            }}
          >
            <ArrowLeft size={14} /> BACK TO MAP
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div
              style={{
                width: 60, height: 60, borderRadius: "50%",
                border: `2px solid ${module.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 24px ${module.color}66`,
                flexShrink: 0,
              }}
            >
              <module.icon size={28} color={module.color} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: 2 }}>{module.name}</div>
              <div className="g-label" style={{ fontSize: 12, color: "#7fb8c9", marginTop: 4 }}>
                DATABASE ITEM #{module.id}
              </div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div className="g-label" style={{ fontSize: 10, color: "#1c5b6e" }}>QTY</div>
              <div style={{ fontSize: 27, fontWeight: 700 }}>{module.quantity}</div>
            </div>
          </div>

          <div style={{ background: "rgba(10,24,36,.55)", border: "1px solid rgba(76,231,255,.25)", padding: "6px 18px" }}>
            <div className="g-label" style={{ fontSize: 10, color: "#4ce7ff", letterSpacing: 2, padding: "10px 0", borderBottom: "1px solid rgba(76,231,255,.2)" }}>
              MODULE BRIEFING
            </div>
            <Fact color={module.color} n="01" text={`Unit price: ${module.price != null ? `$${module.price}` : "—"}`} />
            <Fact color={module.color} n="02" text={`Quantity in stock: ${module.quantity}`} />
            <Fact color={module.color} n="03" text={`Database ID: #${module.id}`} />
          </div>
        </div>
      )}
    </div>
  );
}

function Fact({ color, n, text }) {
  return (
    <div className="g-fact">
      <span style={{ color, fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{n}</span>
      <span style={{ fontSize: 14 }}>{text}</span>
    </div>
  );
}
