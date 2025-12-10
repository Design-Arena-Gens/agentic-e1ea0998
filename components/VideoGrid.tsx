import VideoCard from "./VideoCard";
import { Video } from "@/lib/types";

interface VideoGridProps {
  videos: Video[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Latest Releases</h2>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
