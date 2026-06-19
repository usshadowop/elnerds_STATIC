import { useEffect, useState } from "react";

function getPath() {
  const base = import.meta.env.BASE_URL;
  let path = window.location.pathname;
  if (path.startsWith(base)) path = path.slice(base.length);
  return path.replace(/^\/+|\/+$/g, "");
}

export function usePath() {
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return path;
}

export function navigate(to: string) {
  const url = `${import.meta.env.BASE_URL}${to}`.replace(/\/+/g, "/");
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
