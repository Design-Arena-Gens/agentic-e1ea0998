import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import VideoGrid from "@/components/VideoGrid";
import { listVideos } from "@/lib/cloudflare";

export default async function HomePage() {
  const videos = await listVideos();
  const [featured, ...rest] = videos;
  const gridVideos = rest.length > 0 ? rest : featured ? [featured] : [];

  return (
    <div className="min-h-screen bg-surface text-white">
      <Navbar />
      <main className="space-y-12 pb-24">
        {featured && <Hero video={featured} />}
        {gridVideos.length > 0 && <VideoGrid videos={gridVideos} />}
      </main>
    </div>
  );
}
