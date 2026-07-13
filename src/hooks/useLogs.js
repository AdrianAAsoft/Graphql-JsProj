import { useCallback, useEffect, useState } from "react";
import { graphqlRequest, LOGS_QUERY, CREATE_LOG_MUTATION } from "../api/graphqlClient.js";

// DB-backed event log. logs are kept newest-first to match the LOG world.
export function useLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    graphqlRequest(LOGS_QUERY)
      .then((d) => setLogs(d.logs || []))
      .catch(() => {});
  }, []);

  // write an event to the DB, then prepend the returned row locally (no full refetch)
  const writeLog = useCallback((message, level = "info") => {
    graphqlRequest(CREATE_LOG_MUTATION, { level, message })
      .then((d) => setLogs((prev) => [d.createLog, ...prev]))
      .catch(() => {});
  }, []);

  return { logs, writeLog };
}
