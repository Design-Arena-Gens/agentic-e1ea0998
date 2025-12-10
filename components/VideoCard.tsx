import Image from "next/image";
import Link from "next/link";
import { Video } from "@/lib/types";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link
      href={`/watch/${encodeURIComponent(video.id)}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-black/40 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={
            video.thumbnailUrl ??
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
          }
          alt={video.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(min-width: 768px) 33vw, 100vw"
          priority={false}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80 transition group-hover:opacity-60" />
        <span className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
          {video.tags?.[0] ?? "Featured"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold">{video.title}</h3>
        <p className="text-sm text-white/70 line-clamp-2">{video.description}</p>
      </div>
    </Link>
  );
}
