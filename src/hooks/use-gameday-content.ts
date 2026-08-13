import { useEffect, useState } from "react";

import {
  FALLBACK_CONTENT,
  fetchGamedayContent,
  type GamedayContent,
} from "@/lib/gamedayContent";

export interface UseGamedayContent {
  content: GamedayContent;
  /** True once a live read has landed — i.e. what's on screen came from the
   *  sheet rather than the copy baked into the site. */
  isLive: boolean;
}

/**
 * The Command Center's contents, re-read on an interval so an edit made in the
 * sheet during the marathon reaches a page that's been sitting open on someone's
 * second monitor for six hours.
 *
 * A failed read is not an error state: the last good content stays on screen
 * (falling back to what shipped with the site), because a stale run of show is
 * far better than a blank page in the middle of the event.
 */
export function useGamedayContent(intervalMs = 60_000): UseGamedayContent {
  const [content, setContent] = useState<GamedayContent>(FALLBACK_CONTENT);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function read() {
      try {
        const next = await fetchGamedayContent(controller.signal);
        if (cancelled) return;
        setContent(next);
        setIsLive(true);
      } catch {
        // Keep whatever is already on screen.
      }
    }

    read();
    const id = window.setInterval(read, intervalMs);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(id);
    };
  }, [intervalMs]);

  return { content, isLive };
}
