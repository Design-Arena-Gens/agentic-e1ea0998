import Link from "next/link";
import { Video } from "@/lib/types";

interface HeroProps {
  video: Video;
}

export default function Hero({ video }: HeroProps) {
  return (
    <section className="relative min-h-[60vh] overflow-hidden rounded-b-3xl border-b border-white/10 bg-surfaceAlt">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            video.thumbnailUrl ??
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&q=80"
          })`
        }}
      />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="relative mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-center gap-6 px-6 py-16">
        <div className="max-w-xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-light">
            Featured
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">{video.title}</h1>
          <p className="mt-4 text-base text-white/80">{video.description}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/watch/${encodeURIComponent(video.id)}`}
            className="rounded bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Watch Now
          </Link>
          <Link
            href="/upload"
            className="rounded bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Upload Video
          </Link>
        </div>
      </div>
    </section>
  );
}
