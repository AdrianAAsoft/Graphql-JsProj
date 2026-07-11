import React, { useState } from "react";
import "./hud.css";
import LoginScreen from "./components/LoginScreen.jsx";
import GalaxyHUD from "./GalaxyHUD.jsx";

export default function App() {
  const [operator, setOperator] = useState(null);

  if (!operator) {
    return <LoginScreen onLogin={(callsign) => setOperator(callsign.toUpperCase())} />;
  }
  return <GalaxyHUD operator={operator} />;
}
