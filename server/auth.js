import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

const SECRET = process.env.JWT_SECRET || "dev-only-change-me-in-production";
const EXPIRES_IN = "30m"; // token lives 30 minutes

// issue a signed token for a logged-in user
export function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, name: user.name },
    SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

// verify a token from the Authorization header; returns the payload or null
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null; // expired or tampered
  }
}

// throw a 401-style error if the request has no valid token
export function requireAuth(ctx) {
  if (!ctx || !ctx.user) {
    throw new GraphQLError("Unauthorized — please sign in again", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return ctx.user;
}
