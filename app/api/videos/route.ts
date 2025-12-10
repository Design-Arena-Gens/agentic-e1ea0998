import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getPlaybackUrlForAssetKey,
  listVideos,
  saveVideoMetadata
} from "@/lib/cloudflare";
import { env } from "@/lib/env";

const createVideoSchema = z.object({
  adminKey: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  assetKey: z.string().min(1),
  thumbnailUrl: z.string().url().optional(),
  durationSeconds: z.number().int().positive().optional(),
  tags: z.array(z.string().min(1)).max(5).optional()
});

export async function GET() {
  try {
    const videos = await listVideos();
    return NextResponse.json({ videos });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to fetch videos."
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!env.UPLOAD_ADMIN_KEY) {
    return NextResponse.json(
      { error: "Upload admin key is not configured." },
      { status: 500 }
    );
  }

  const raw = await request.json();
  const parsed = createVideoSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { adminKey, title, description, assetKey, thumbnailUrl, durationSeconds, tags } =
    parsed.data;

  if (adminKey !== env.UPLOAD_ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const playbackUrl = getPlaybackUrlForAssetKey(assetKey);
    const video = await saveVideoMetadata({
      id: assetKey,
      title,
      description,
      playbackUrl,
      thumbnailUrl,
      durationSeconds,
      tags,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ video });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to store video metadata." },
      { status: 500 }
    );
  }
}
