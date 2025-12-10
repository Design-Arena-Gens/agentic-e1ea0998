import { NextResponse } from "next/server";
import { z } from "zod";
import { createSignedUploadUrl } from "@/lib/cloudflare";
import { env } from "@/lib/env";

const uploadPayload = z.object({
  adminKey: z.string().min(1),
  fileName: z.string().min(1),
  contentType: z.string().min(1)
});

export async function POST(request: Request) {
  if (!env.UPLOAD_ADMIN_KEY) {
    return NextResponse.json(
      { error: "Upload admin key is not configured." },
      { status: 500 }
    );
  }

  const raw = await request.json();
  const parsed = uploadPayload.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { adminKey, fileName, contentType } = parsed.data;

  if (adminKey !== env.UPLOAD_ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const signed = await createSignedUploadUrl(fileName, contentType);
    return NextResponse.json(signed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to generate upload URL." },
      { status: 500 }
    );
  }
}
