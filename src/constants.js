// change this if your backend runs elsewhere (docker host, deployed url, etc.)
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/graphql";

export const COLORS = ["#4ce7ff", "#7dffb0", "#ffab4d", "#ff6b6b", "#c792ff", "#ffe14d", "#4dffd8", "#ff944d"];
export const ORBITS = [130, 190, 250, 310];

// svg viewBox size + center point, shared by every component that draws in it
export const VB = 760;
export const C = VB / 2;
