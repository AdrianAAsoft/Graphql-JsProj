import React, { useState } from "react";
import { graphqlRequest, CREATE_ITEM_MUTATION } from "../api/graphqlClient.js";

export default function AddModuleForm({ onAdded, onClose }) {
  const [descript, setDescript] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await graphqlRequest(CREATE_ITEM_MUTATION, {
        descript,
        price: price === "" ? null : Number(price),
        quantity: Number(quantity),
      });
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    background: "rgba(10,24,36,.55)",
    border: "1px solid rgba(76,231,255,.3)",
    color: "#eafcff",
    padding: "8px 10px",
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="g-label"
      style={{
        position: "relative", zIndex: 3, display: "flex", gap: 10, alignItems: "center",
        flexWrap: "wrap", padding: "10px 28px", fontSize: 11,
      }}
    >
      <input style={inputStyle} placeholder="DESCRIPTION" value={descript} onChange={(e) => setDescript(e.target.value)} required />
      <input style={{ ...inputStyle, width: 90 }} type="number" step="0.01" placeholder="PRICE" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input style={{ ...inputStyle, width: 80 }} type="number" placeholder="QTY" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      <button type="submit" disabled={submitting} style={{ ...inputStyle, cursor: "pointer", color: "#4ce7ff" }}>
        {submitting ? "ADDING..." : "CONFIRM"}
      </button>
      <button type="button" onClick={onClose} style={{ ...inputStyle, cursor: "pointer" }}>
        CANCEL
      </button>
      {error && <span style={{ color: "#ff6b6b" }}>{error}</span>}
    </form>
  );
}
