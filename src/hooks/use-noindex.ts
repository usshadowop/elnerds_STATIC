import { useEffect } from "react";

// Asks search engines not to index the current page, for team pages that are
// public but shouldn't turn up in search results (/sitemap, /library). The
// pages are deliberately left out of robots.txt: that file is public, so
// listing them there would advertise them, and a crawler barred by robots.txt
// never sees the noindex tag. Google renders the app before indexing, so a tag
// added here is honored.
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}
