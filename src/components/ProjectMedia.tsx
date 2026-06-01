import { resolveProjectVideo } from "@/lib/projectMedia";

type ProjectMediaProps = {
  demoVideo?: string;
  title: string;
};

export default function ProjectMedia({ demoVideo, title }: ProjectMediaProps) {
  if (!demoVideo) return null;

  const video = resolveProjectVideo(demoVideo);
  if (!video) return null;

  if (video.kind === "file") {
    return (
      <div className="project-media">
        <p className="project-media__label">Demo</p>
        <video
          className="project-media__video"
          controls
          playsInline
          preload="metadata"
          aria-label={`${title} demo video`}
        >
          <source src={video.src} />
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  return (
    <div className="project-media">
      <p className="project-media__label">Demo</p>
      <div className="project-media__embed">
        <iframe
          src={video.embedUrl}
          title={`${title} demo`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
