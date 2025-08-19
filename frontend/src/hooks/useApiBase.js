// src/hooks/useApiBase.js
import { useEffect, useState } from "react";

export default function useApiBase() {
  const [apiBase, setApiBase] = useState("");

  useEffect(() => {
    const isProd = location.hostname.endsWith("github.io");
    const cfgUrl = isProd
      ? "https://game-genie-1.onrender.com/api/config" // absolute for GH Pages
      : "/api/config";                                  // works in local dev via proxy

    fetch(cfgUrl)
      .then(r => r.json())
      .then(d => {
        const base = (d.renderUrl || "").replace(/\/+$/,""); // strip trailing slashes
        setApiBase(`${base}/api`);
      })
      .catch(e => console.error("config error", e));
  }, []);

  return apiBase; // empty string until ready
}
