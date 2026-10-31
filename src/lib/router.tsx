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

/**
 * Make `#anchor` links land on first load.
 *
 * The HTML the server sends is empty until React renders, so when the browser
 * goes looking for `#gameday-schedule` at load time there is nothing to find
 * and it stays at the top (a refresh "works" only because the browser restores
 * the previous scroll position). Even after render the page keeps growing for
 * a second or two — the hero's ticker, the roster from DonorDrive, images —
 * and each shift pushes the target further down. So: scroll to the hash once
 * the element exists, then again on a short schedule while the page settles,
 * and stop the moment the visitor scrolls themselves.
 */
const SETTLE_SCHEDULE_MS = [0, 150, 400, 800, 1500, 2500];

export function useHashScroll(deps: unknown[] = []) {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };
    // A real scroll from the visitor means they've taken over; a programmatic
    // one from us does not fire these.
    const takeovers = ["wheel", "touchstart", "keydown"] as const;
    takeovers.forEach((ev) => window.addEventListener(ev, cancel, { passive: true }));

    const timers = SETTLE_SCHEDULE_MS.map((ms) =>
      window.setTimeout(() => {
        if (cancelled) return;
        const el = document.getElementById(decodeURIComponent(hash));
        if (!el) return;
        // Jump on the first hit so the page doesn't glide for two seconds;
        // the follow-ups are small corrections and can be instant too.
        el.scrollIntoView({ behavior: "auto", block: "start" });
      }, ms),
    );

    return () => {
      timers.forEach(clearTimeout);
      takeovers.forEach((ev) => window.removeEventListener(ev, cancel));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
