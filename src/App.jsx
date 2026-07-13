import React, { useEffect, useState } from "react";
import "./hud.css";
import LoginScreen from "./components/LoginScreen.jsx";
import GalaxyHUD from "./GalaxyHUD.jsx";
import { setAuthToken, setAuthErrorHandler } from "./api/graphqlClient.js";

const TOKEN_KEY = "jarvis_token";

// restore a saved session on load, but only if the token hasn't expired.
// runs once (lazy useState initializer) so the token is set before any request fires.
function loadSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    setAuthToken(token);
    return { name: payload.name || payload.username };
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export default function App() {
  const [session, setSession] = useState(loadSession);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setSession(null);
  };

  // the server calls this (via graphqlRequest) when the token expires mid-session
  useEffect(() => {
    setAuthErrorHandler(logout);
  }, []);

  if (!session) {
    return (
      <LoginScreen
        onLogin={({ token, user }) => {
          localStorage.setItem(TOKEN_KEY, token);
          setAuthToken(token);
          setSession({ name: user?.name || user?.username });
        }}
      />
    );
  }

  return <GalaxyHUD operator={(session.name || "COMMANDER").toUpperCase()} onLogout={logout} />;
}
