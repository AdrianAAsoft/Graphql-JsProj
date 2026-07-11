import { useEffect, useState } from "react";

// advances a time value (seconds) every animation frame; freezes while
// pausedRef.current is true (a ref so callers can set it later in the render)
export function useOrbitTime(pausedRef) {
  const [t, setT] = useState(0);

  useEffect(() => {
    let id;
    let last = null;
    const step = (now) => {
      if (last != null && !pausedRef.current) {
        const dt = Math.min((now - last) / 1000, 0.1); // clamp tab-switch jumps
        setT((v) => v + dt);
      }
      last = now;
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, []);

  return t;
}
