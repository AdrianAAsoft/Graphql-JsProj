import { API_URL } from "../constants.js";

export async function graphqlRequest(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
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
