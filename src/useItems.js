import { useEffect, useState, useCallback } from "react";
import { graphqlRequest, ITEMS_QUERY } from "../api/graphqlClient.js";

export function useItems() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  const refetch = useCallback(() => {
    setStatus("loading");
    graphqlRequest(ITEMS_QUERY)
      .then((data) => {
        setItems(data.items || []);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { items, status, refetch };
}
