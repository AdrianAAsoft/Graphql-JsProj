import { API_URL } from "../constants.js";

// current JWT + a handler to call when the server rejects it (expired/missing)
let authToken = null;
let onAuthError = null;
export function setAuthToken(token) { authToken = token; }
export function setAuthErrorHandler(fn) { onAuthError = fn; }

export async function graphqlRequest(query, variables = {}) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    // a rejected/expired token: log the user out (bad login uses BAD_CREDENTIALS, not this)
    if (json.errors[0]?.extensions?.code === "UNAUTHENTICATED" && onAuthError) onAuthError();
    throw new Error(json.errors[0].message);
  }
  return json.data;
}

export const ITEMS_QUERY = `query { items { id description price quantity } }`;

export const USERS_QUERY = `query { users { id name item { id description } } }`;

export const CREATE_USER_MUTATION = `
  mutation CreateUsr($name: String!, $item: ID) {
    createUsr(name: $name, item: $item) {
      id name
    }
  }
`;

export const CREATE_ITEM_MUTATION = `
  mutation CreateItm($descript: String!, $price: Float, $quantity: Int!) {
    createItm(descript: $descript, price: $price, quantity: $quantity) {
      id description price quantity
    }
  }
`;

export const UPDATE_ITEM_MUTATION = `
  mutation UpdItm($id: ID!, $descript: String, $price: Float, $quantity: Int) {
    updateItm(id: $id, descript: $descript, price: $price, quantity: $quantity) {
      id description price quantity
    }
  }
`;

export const SPECIFIC_USER_QUERY = `
  query Specific($id: ID!) {
    SpecificUsers(id: $id) {
      id name username email item { id description }
    }
  }
`;

// ---- auth ----
export const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user { id name username }
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($name: String!, $username: String!, $password: String!, $email: String) {
    createUsr(name: $name, username: $username, password: $password, email: $email) {
      id name username
    }
  }
`;

// ---- persistent event log (DB-backed) ----
export const LOGS_QUERY = `query { logs { id level message created_at } }`;

export const CREATE_LOG_MUTATION = `
  mutation CreateLog($level: String, $message: String!) {
    createLog(level: $level, message: $message) {
      id level message created_at
    }
  }
`;
