import { createClient } from "graphql-ws";
import { API_URL } from "../constants.js";

// same endpoint as the queries, but over websocket
const wsClient = createClient({
  url: API_URL.replace(/^http/, "ws"),
  shouldRetry: () => true,
  retryAttempts: Infinity,
});

// subscribe to a graphql subscription; returns an unsubscribe function
export function subscribe(query, onData) {
  return wsClient.subscribe(
    { query },
    {
      next: ({ data }) => data && onData(data),
      error: (err) => console.warn("subscription error:", err),
      complete: () => {},
    }
  );
}

export const ITEM_CREATED_SUB = `subscription { itemCreated { id description price quantity } }`;
export const USER_UPDATED_SUB = `subscription { usrUpdated { id name } }`;
