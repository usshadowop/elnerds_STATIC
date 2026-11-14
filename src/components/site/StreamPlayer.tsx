import { useState } from "react";
import { LoaderCircle } from "lucide-react";

/** The teal spinner a stream tile shows while its stream loads, in the same
 *  style as `LoadingBox` (spinner over a line of text; still for reduced
 *  motion). Fills its parent, which must be `relative`. */
export function StreamLoading() {
  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-paper text-sm font-semibold text-ink-soft"
    >
      <LoaderCircle className="size-[30px] animate-spin text-teal motion-reduce:animate-none" strokeWidth={2.6} aria-hidden />
      Loading the stream&hellip;
    </div>
  );
}

/** A stream's embedded player (Twitch, YouTube, …), covered by the spinner
 *  until the player's page has loaded, so a tile never sits blank. A new
 *  `src` brings the spinner back until that one loads. The parent must be
 *  `relative`. */
export function StreamPlayer({ src, title }: { src: string; title: string }) {
  const [loadedSrc, setLoadedSrc] = useState<string>();

  return (
    <>
      <iframe
        src={src}
        title={title}
        allowFullScreen
        onLoad={() => setLoadedSrc(src)}
        className="size-full"
      />
      {loadedSrc !== src && <StreamLoading />}
    </>
  );
}
