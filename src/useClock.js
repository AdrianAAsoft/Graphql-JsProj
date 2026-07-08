import { useEffect, useState } from "react";

export function useClock() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(new Date().toTimeString().slice(0, 8));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return clock;
}
