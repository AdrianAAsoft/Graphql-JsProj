import { useState } from "react";
import { VB } from "../constants.js";

export function useFlyTo(planets) {
  const [hovered, setHovered] = useState(null);
  const [zoomedIndex, setZoomedIndex] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");

  const flyTo = (i) => {
    if (zoomedIndex !== null) return;
    const p = planets[i];
    setZoomOrigin(`${(p.x / VB) * 100}% ${(p.y / VB) * 100}%`);
    setActiveModule(p);
    setZoomedIndex(i);
    setTimeout(() => setDetailVisible(true), 650);
  };

  const backToMap = () => {
    setDetailVisible(false);
    setTimeout(() => setZoomedIndex(null), 300);
    setTimeout(() => setActiveModule(null), 950);
  };

  return {
    hovered, setHovered,
    zoomedIndex, zoomOrigin, detailVisible,
    activeModule, flyTo, backToMap,
  };
}
