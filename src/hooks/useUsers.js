import { useEffect, useState, useCallback } from "react";
import { graphqlRequest, USERS_QUERY } from "../api/graphqlClient.js";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  const refetch = useCallback(() => {
    setStatus("loading");
    graphqlRequest(USERS_QUERY)
      .then((data) => {
        setUsers(data.users || []);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { users, status, refetch };
}
