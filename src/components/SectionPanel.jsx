import React, { useState } from "react";
import { ArrowLeft, Package, Users as UsersIcon, Activity, ScrollText } from "lucide-react";
import { graphqlRequest, CREATE_ITEM_MUTATION, UPDATE_ITEM_MUTATION, CREATE_USER_MUTATION, SPECIFIC_USER_QUERY } from "../api/graphqlClient.js";

const inputStyle = {
  background: "rgba(8,20,34,.7)", border: "1px solid rgba(76,231,255,.3)",
  color: "#eafcff", padding: "8px 10px", fontSize: 12,
  fontFamily: "'JetBrains Mono', monospace",
};

const PAGE_SIZE = 10;

// text filter + pagination over a list of rows; textOf extracts the searchable string
function usePagedFilter(rows, textOf) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = query
    ? rows.filter((r) => textOf(r).toLowerCase().includes(query.toLowerCase()))
    : rows;
  const pages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const safePage = Math.min(page, pages - 1);
  const view = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const search = (q) => { setQuery(q); setPage(0); };
  return { view, filtered, query, search, page: safePage, pages, setPage };
}

function TableControls({ pf, color, placeholder }) {
  const btn = { ...inputStyle, cursor: "pointer", color, padding: "8px 12px" };
  return (
    <div className="g-label" style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, fontSize: 11 }}>
      <input
        style={{ ...inputStyle, flex: 1, minWidth: 120 }}
        placeholder={placeholder}
        value={pf.query}
        onChange={(e) => pf.search(e.target.value)}
      />
      <button style={btn} disabled={pf.page === 0} onClick={() => pf.setPage(pf.page - 1)}>◀</button>
      <span style={{ color: "#7fb8c9", fontSize: 10, whiteSpace: "nowrap" }}>
        PAGE {pf.page + 1}/{pf.pages} // {pf.filtered.length} RECORDS
      </span>
      <button style={btn} disabled={pf.page >= pf.pages - 1} onClick={() => pf.setPage(pf.page + 1)}>▶</button>
    </div>
  );
}

function PanelHeader({ icon: Icon, color, title, subtitle, onBack }) {
  return (
    <>
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
        <ArrowLeft size={14} /> BACK TO ORBIT
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div
          style={{
            width: 60, height: 60, borderRadius: "50%",
            border: `2px solid ${color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 24px ${color}66`, flexShrink: 0,
          }}
        >
          <Icon size={28} color={color} strokeWidth={1.8} />
        </div>
        <div>
          <div className="j-flicker" style={{ fontSize: 23, fontWeight: 700, letterSpacing: 2 }}>{title}</div>
          <div className="g-label" style={{ fontSize: 12, color: "#7fb8c9", marginTop: 4 }}>{subtitle}</div>
        </div>
      </div>
    </>
  );
}

function ItemsSection({ items, refetchItems: refetch, onBack }) {
  const pf = usePagedFilter(items, (it) => `${it.id} ${it.description || ""}`);
  const [descript, setDescript] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // per-row edit (updateItm)
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState({ descript: "", price: "", quantity: "" });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await graphqlRequest(CREATE_ITEM_MUTATION, {
        descript, price: price === "" ? null : Number(price), quantity: Number(quantity),
      });
      setDescript(""); setPrice(""); setQuantity("");
      refetch();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const startEdit = (it) => {
    setEditId(it.id);
    setEdit({ descript: it.description || "", price: it.price ?? "", quantity: it.quantity });
  };

  const saveEdit = async () => {
    try {
      await graphqlRequest(UPDATE_ITEM_MUTATION, {
        id: editId,
        descript: edit.descript,
        price: edit.price === "" ? null : Number(edit.price),
        quantity: edit.quantity === "" ? null : Number(edit.quantity),
      });
      setEditId(null);
      refetch();
    } catch (err) { setError(err.message); }
  };

  return (
    <>
      <PanelHeader icon={Package} color="#4ce7ff" title="CARGO MANIFEST" subtitle={`${items.length} ITEMS IN STORAGE`} onBack={onBack} />

      <form onSubmit={submit} className="g-label" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, fontSize: 11 }}>
        <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} placeholder="DESCRIPTION" value={descript} onChange={(e) => setDescript(e.target.value)} required />
        <input style={{ ...inputStyle, width: 90 }} type="number" step="0.01" placeholder="PRICE" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input style={{ ...inputStyle, width: 70 }} type="number" placeholder="QTY" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <button type="submit" disabled={busy} style={{ ...inputStyle, cursor: "pointer", color: "#4ce7ff" }}>
          {busy ? "..." : "+ DEPLOY"}
        </button>
        {error && <span style={{ color: "#ff6b6b", alignSelf: "center" }}>{error}</span>}
      </form>

      <TableControls pf={pf} color="#4ce7ff" placeholder="FILTER CARGO..." />

      <div className="j-panel" style={{ padding: "6px 18px" }}>
        <div className="g-label" style={{ display: "grid", gridTemplateColumns: "50px 1fr 90px 60px 90px", gap: 10, fontSize: 10, color: "#4ce7ff", letterSpacing: 2, padding: "10px 0", borderBottom: "1px solid rgba(76,231,255,.2)" }}>
          <span>ID</span><span>DESIGNATION</span><span>PRICE</span><span>QTY</span><span></span>
        </div>
        {pf.view.map((it, i) => (
          <div key={it.id} className="g-fact j-row-in" style={{ display: "grid", gridTemplateColumns: "50px 1fr 90px 60px 90px", gap: 10, alignItems: "center", animationDelay: `${i * 60}ms` }}>
            <span style={{ color: "#4ce7ff", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>#{it.id}</span>
            {editId === it.id ? (
              <>
                <input style={{ ...inputStyle, padding: "4px 8px" }} value={edit.descript} onChange={(e) => setEdit({ ...edit, descript: e.target.value })} />
                <input style={{ ...inputStyle, padding: "4px 8px" }} type="number" step="0.01" value={edit.price} onChange={(e) => setEdit({ ...edit, price: e.target.value })} />
                <input style={{ ...inputStyle, padding: "4px 8px" }} type="number" value={edit.quantity} onChange={(e) => setEdit({ ...edit, quantity: e.target.value })} />
                <span style={{ display: "flex", gap: 6 }}>
                  <button className="g-label" onClick={saveEdit} style={{ ...inputStyle, padding: "4px 8px", cursor: "pointer", color: "#7dffb0", fontSize: 10 }}>SAVE</button>
                  <button className="g-label" onClick={() => setEditId(null)} style={{ ...inputStyle, padding: "4px 8px", cursor: "pointer", fontSize: 10 }}>✕</button>
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 14 }}>{(it.description || "").toUpperCase()}</span>
                <span style={{ fontSize: 13, color: "#7dffb0" }}>{it.price != null ? `$${it.price}` : "—"}</span>
                <span style={{ fontSize: 13 }}>{it.quantity}</span>
                <button className="g-label" onClick={() => startEdit(it)} style={{ ...inputStyle, padding: "4px 8px", cursor: "pointer", color: "#4ce7ff", fontSize: 10 }}>EDIT</button>
              </>
            )}
          </div>
        ))}
        {pf.filtered.length === 0 && (
          <div className="g-label" style={{ padding: 14, fontSize: 11, color: "#1c5b6e" }}>
            {items.length === 0 ? "STORAGE EMPTY" : "NO MATCHES"}
          </div>
        )}
      </div>
    </>
  );
}

function UsersSection({ users, items, refetchUsers: refetch, onBack }) {
  const pf = usePagedFilter(users, (u) => `${u.id} ${u.name || ""} ${u.item?.description || ""}`);
  const [name, setName] = useState("");
  const [itemId, setItemId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // full detail of a selected crew member (SpecificUsers)
  const [detail, setDetail] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await graphqlRequest(CREATE_USER_MUTATION, { name, item: itemId === "" ? null : itemId });
      setName(""); setItemId("");
      refetch();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const openDetail = async (id) => {
    setDetail({ loading: true });
    try {
      const d = await graphqlRequest(SPECIFIC_USER_QUERY, { id });
      setDetail(d.SpecificUsers);
    } catch (err) { setError(err.message); setDetail(null); }
  };

  return (
    <>
      <PanelHeader icon={UsersIcon} color="#7dffb0" title="CREW ROSTER" subtitle={`${users.length} PERSONNEL REGISTERED`} onBack={onBack} />

      <form onSubmit={submit} className="g-label" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, fontSize: 11 }}>
        <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} placeholder="NAME" value={name} onChange={(e) => setName(e.target.value)} required />
        <select style={{ ...inputStyle, width: 180 }} value={itemId} onChange={(e) => setItemId(e.target.value)}>
          <option value="">NO EQUIPMENT</option>
          {items.map((it) => (
            <option key={it.id} value={it.id}>#{it.id} {(it.description || "").toUpperCase()}</option>
          ))}
        </select>
        <button type="submit" disabled={busy} style={{ ...inputStyle, cursor: "pointer", color: "#7dffb0" }}>
          {busy ? "..." : "+ ENLIST"}
        </button>
        {error && <span style={{ color: "#ff6b6b", alignSelf: "center" }}>{error}</span>}
      </form>

      <TableControls pf={pf} color="#7dffb0" placeholder="FILTER CREW..." />

      <div className="j-panel" style={{ padding: "6px 18px" }}>
        <div className="g-label" style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr", gap: 10, fontSize: 10, color: "#7dffb0", letterSpacing: 2, padding: "10px 0", borderBottom: "1px solid rgba(76,231,255,.2)" }}>
          <span>ID</span><span>CALLSIGN</span><span>EQUIPMENT</span>
        </div>
        {pf.view.map((u, i) => (
          <div key={u.id} onClick={() => openDetail(u.id)} className="g-fact g-hit j-row-in" style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr", gap: 10, cursor: "pointer", animationDelay: `${i * 60}ms` }}>
            <span style={{ color: "#7dffb0", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>#{u.id}</span>
            <span style={{ fontSize: 14 }}>{(u.name || "").toUpperCase()}</span>
            <span style={{ fontSize: 13, color: "#7fb8c9" }}>{u.item ? (u.item.description || "").toUpperCase() : "—"}</span>
          </div>
        ))}
        {pf.filtered.length === 0 && (
          <div className="g-label" style={{ padding: 14, fontSize: 11, color: "#1c5b6e" }}>
            {users.length === 0 ? "NO PERSONNEL ON RECORD" : "NO MATCHES"}
          </div>
        )}
      </div>

      {detail && (
        <div className="j-panel g-label j-row-in" style={{ marginTop: 14, padding: "14px 18px", fontSize: 12 }}>
          {detail.loading ? (
            <span style={{ color: "#7fb8c9" }}>QUERYING PERSONNEL FILE...</span>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#7dffb0", letterSpacing: 2 }}>PERSONNEL FILE #{detail.id}</span>
                <span onClick={() => setDetail(null)} style={{ cursor: "pointer", color: "#7fb8c9" }}>✕</span>
              </div>
              <div style={{ color: "#cfe3ee", lineHeight: 1.9 }}>
                <div>NAME // {(detail.name || "—").toUpperCase()}</div>
                <div>CALLSIGN // {detail.username || "—"}</div>
                <div>MAIL // {detail.email || "—"}</div>
                <div>EQUIPMENT // {detail.item ? (detail.item.description || "").toUpperCase() : "NONE"}</div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

function SystemSection({ items, users, itemsStatus, usersStatus, operator, onBack }) {
  const totalValue = items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0);
  const rows = [
    ["OPERATOR", operator],
    ["GRAPHQL UPLINK", itemsStatus === "ok" ? "STABLE" : itemsStatus.toUpperCase()],
    ["CREW UPLINK", usersStatus === "ok" ? "STABLE" : usersStatus.toUpperCase()],
    ["ITEMS TRACKED", String(items.length)],
    ["PERSONNEL", String(users.length)],
    ["CARGO VALUATION", `$${totalValue.toFixed(2)}`],
  ];
  return (
    <>
      <PanelHeader icon={Activity} color="#ffab4d" title="SYSTEM CORE" subtitle="TELEMETRY & DIAGNOSTICS" onBack={onBack} />
      <div className="j-panel" style={{ padding: "6px 18px" }}>
        {rows.map(([k, v], i) => (
          <div key={k} className="g-fact j-row-in" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="g-label" style={{ color: "#ffab4d", fontSize: 11, width: 180, flexShrink: 0 }}>{k}</span>
            <span style={{ fontSize: 14 }}>{v}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// format an ISO timestamp into HH:MM:SS for the log table
function logTime(iso) {
  const d = new Date(iso);
  return isNaN(d) ? "--:--:--" : d.toTimeString().slice(0, 8);
}

function LogSection({ events, onBack }) {
  // events come from the DB already newest-first
  const pf = usePagedFilter(events, (ev) => ev.message);
  return (
    <>
      <PanelHeader icon={ScrollText} color="#ff6b6b" title="EVENT LOG" subtitle={`${events.length} EVENTS ON RECORD`} onBack={onBack} />
      <TableControls pf={pf} color="#ff6b6b" placeholder="FILTER EVENTS..." />
      <div className="j-panel" style={{ padding: "6px 18px" }}>
        <div className="g-label" style={{ display: "grid", gridTemplateColumns: "90px 70px 1fr", gap: 10, fontSize: 10, color: "#ff6b6b", letterSpacing: 2, padding: "10px 0", borderBottom: "1px solid rgba(76,231,255,.2)" }}>
          <span>TIME</span><span>LEVEL</span><span>EVENT</span>
        </div>
        {pf.view.map((ev, i) => (
          <div key={ev.id} className="g-fact j-row-in" style={{ display: "grid", gridTemplateColumns: "90px 70px 1fr", gap: 10, animationDelay: `${Math.min(i, 10) * 50}ms` }}>
            <span style={{ color: "#ff6b6b", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{logTime(ev.created_at)}</span>
            <span className="g-label" style={{ fontSize: 10, color: ev.level === "auth" ? "#7dffb0" : "#7fb8c9" }}>{(ev.level || "info").toUpperCase()}</span>
            <span className="g-label" style={{ fontSize: 12, color: "#cfe3ee" }}>{ev.message}</span>
          </div>
        ))}
        {pf.filtered.length === 0 && (
          <div className="g-label" style={{ padding: 14, fontSize: 11, color: "#1c5b6e" }}>
            {events.length === 0 ? "NO EVENTS RECORDED" : "NO MATCHES"}
          </div>
        )}
      </div>
    </>
  );
}

// panel registry: to add a new world, register its panel component here
// (and add the matching entry to SECTIONS in GalaxyHUD.jsx)
const PANELS = {
  items: ItemsSection,
  users: UsersSection,
  system: SystemSection,
  log: LogSection,
};

// tiny live orbit map so you can hop between worlds without flying out
function MiniMap({ worlds, active, onNavigate }) {
  const sx = (v) => (v / 760) * 150;        // scale galaxy coords into the widget
  const sy = (v) => (v / 760) * 150 - 35;
  return (
    <div className="j-panel" style={{ position: "absolute", top: 64, right: 20, padding: "8px 12px 4px", zIndex: 5 }}>
      <div className="g-label" style={{ fontSize: 8, color: "#4ce7ff", letterSpacing: 2, marginBottom: 2 }}>
        MODULES IN ORBIT
      </div>
      <svg width="150" height="84" viewBox="0 0 150 84">
        {[26, 38, 50].map((r) => (
          <ellipse key={r} cx="75" cy="40" rx={r} ry={r * 0.55} fill="none" stroke="rgba(76,231,255,.18)" strokeDasharray="2 5" />
        ))}
        <circle cx="75" cy="40" r="4" fill="#4ce7ff" style={{ filter: "drop-shadow(0 0 5px #4ce7ff)" }} />
        {worlds.map((w, i) => {
          const isActive = w.section === active;
          return (
            <g key={w.section} style={{ cursor: "pointer" }} onClick={() => !isActive && onNavigate(i)}>
              {isActive && <circle cx={sx(w.x)} cy={sy(w.y)} r="9" fill="none" stroke={w.color} strokeWidth="1" strokeDasharray="3 3" className="j-spin-fast" style={{ transformOrigin: `${sx(w.x)}px ${sy(w.y)}px` }} />}
              <circle
                cx={sx(w.x)} cy={sy(w.y)} r={isActive ? 5.5 : 4.5}
                fill={w.color}
                opacity={isActive ? 1 : 0.65}
                style={{ filter: `drop-shadow(0 0 5px ${w.color})` }}
              >
                <title>{w.name}</title>
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function SectionPanel({ section, visible, onNavigate, worlds, ...panelProps }) {
  const Panel = section ? PANELS[section] : null;
  return (
    <div
      className={`g-overlay${visible ? " visible" : ""}`}
      style={{ background: "radial-gradient(ellipse at 50% 40%,#0a0a1c 0%,#08081a 45%,#020208 100%)", overflowY: "auto" }}
    >
      {section && <MiniMap worlds={worlds} active={section} onNavigate={onNavigate} />}
      {Panel && (
        <div style={{ padding: "70px 28px 28px", maxWidth: 860, margin: "0 auto" }}>
          <Panel {...panelProps} />
        </div>
      )}
    </div>
  );
}
