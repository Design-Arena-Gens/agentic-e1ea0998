import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getVideoById } from "@/lib/cloudflare";

interface WatchPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params
}: WatchPageProps): Promise<Metadata> {
  const video = await getVideoById(params.id);

  if (!video) {
    return {
      title: "Video not found | StreamSphere"
    };
  }

  return {
    title: `${video.title} | StreamSphere`,
    description: video.description
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const video = await getVideoById(params.id);

  if (!video) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface text-white">
      <Navbar />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-xl">
          <video
            src={video.playbackUrl}
            controls
            poster={video.thumbnailUrl}
            className="h-full w-full"
            preload="metadata"
          />
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">{video.title}</h1>
              <p className="mt-2 text-sm text-white/70">
                Premiered {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
            {video.durationSeconds && (
              <span className="rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-wide text-white/70">
                {Math.floor(video.durationSeconds / 60)}m{" "}
                {video.durationSeconds % 60}s
              </span>
            )}
          </div>
          <p className="text-base text-white/80 leading-relaxed">
            {video.description}
          </p>
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
