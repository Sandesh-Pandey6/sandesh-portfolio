export type VideoEmbed =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "file"; src: string }
  | null;

/** YouTube / Vimeo watch URL → embed, or local path under /public */
export function resolveProjectVideo(url: string): VideoEmbed {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/
  );
  if (youtubeMatch) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      kind: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  if (trimmed.startsWith("/") || trimmed.startsWith("http")) {
    return { kind: "file", src: trimmed };
  }

  return null;
}
