'use client';

import { FormEvent, useMemo, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface UploadStatus {
  stage: "idle" | "signing" | "uploading" | "saving" | "complete" | "error";
  message?: string;
}

export default function UploadPage() {
  const [adminKey, setAdminKey] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [tags, setTags] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | undefined>(
    undefined
  );
  const [status, setStatus] = useState<UploadStatus>({ stage: "idle" });

  const previewUrl = useMemo(() => {
    if (!videoFile) {
      return null;
    }
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  useEffect(() => {
    if (!previewUrl) {
      return;
    }
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setThumbnailUrl("");
    setTags("");
    setVideoFile(null);
    setDurationSeconds(undefined);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!videoFile) {
      setStatus({
        stage: "error",
        message: "Please select a video file before uploading."
      });
      return;
    }

    try {
      setStatus({ stage: "signing", message: "Requesting secure upload link..." });
      const uploadUrlResponse = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminKey,
          fileName: videoFile.name,
          contentType: videoFile.type
        })
      });

      if (!uploadUrlResponse.ok) {
        const error = await uploadUrlResponse.json().catch(() => ({}));
        throw new Error(error.error ?? "Unable to create upload URL.");
      }

      const signed = await uploadUrlResponse.json();

      setStatus({ stage: "uploading", message: "Uploading video to Cloudflare..." });
      const uploadResponse = await fetch(signed.uploadUrl, {
        method: "PUT",
        headers: signed.headers ?? {},
        body: videoFile
      });

      if (!uploadResponse.ok) {
        const body = await uploadResponse.text();
        throw new Error(
          `Upload failed with status ${uploadResponse.status}: ${body}`
        );
      }

      setStatus({
        stage: "saving",
        message: "Saving metadata to Cloudflare database..."
      });

      const saveResponse = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminKey,
          title,
          description,
          assetKey: signed.assetKey,
          thumbnailUrl: thumbnailUrl || undefined,
          durationSeconds: durationSeconds || undefined,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        })
      });

      if (!saveResponse.ok) {
        const error = await saveResponse.json().catch(() => ({}));
        throw new Error(error.error ?? "Failed to store metadata.");
      }

      setStatus({
        stage: "complete",
        message: "Upload complete! Your video is ready to stream."
      });
      resetForm();
    } catch (error) {
      console.error(error);
      setStatus({
        stage: "error",
        message:
          error instanceof Error ? error.message : "Unexpected error occurred."
      });
    }
  }

  return (
    <div className="min-h-screen bg-surface text-white">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Upload a New Video</h1>
        <p className="mt-2 text-sm text-white/60">
          Only trusted creators with an admin key can upload directly to
          Cloudflare. Viewers will stream from the secure Cloudflare R2 bucket.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80">
              Admin Key
            </label>
            <input
              type="password"
              required
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand"
              placeholder="Enter secure uploader key"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              required
              onChange={(event) => {
                const file = event.target.files?.[0];
                setVideoFile(file ?? null);
                if (file && !title) {
                  setTitle(file.name.replace(/\.[^/.]+$/, ""));
                }
              }}
              className="mt-2 w-full rounded-lg border border-dashed border-white/20 bg-black/30 px-4 py-3 file:mr-4 file:rounded file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-white/40"
            />
            {previewUrl && (
              <video
                src={previewUrl}
                controls
                onLoadedMetadata={(event) =>
                  setDurationSeconds(Math.round(event.currentTarget.duration))
                }
                className="mt-4 w-full rounded-lg border border-white/10"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand"
              placeholder="Galactic Horizons"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">
              Description
            </label>
            <textarea
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand"
              placeholder="Describe your story, production notes, or streaming details."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/80">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(event) => setThumbnailUrl(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand"
                placeholder="https://images.example.com/cover.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand"
                placeholder="Sci-Fi, Documentary"
              />
            </div>
          </div>

          {durationSeconds && (
            <p className="text-sm text-white/60">
              Detected duration: {durationSeconds} seconds
            </p>
          )}

          <button
            type="submit"
            className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light disabled:cursor-not-allowed disabled:bg-brand/60"
            disabled={status.stage === "signing" || status.stage === "uploading" || status.stage === "saving"}
          >
            {status.stage === "signing" && "Requesting Link..."}
            {status.stage === "uploading" && "Uploading..."}
            {status.stage === "saving" && "Finalizing..."}
            {status.stage === "complete" && "Uploaded"}
            {["idle", "error"].includes(status.stage) && "Upload Video"}
          </button>
        </form>

        {status.stage !== "idle" && (
          <div
            className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
              status.stage === "error"
                ? "border-red-500/40 bg-red-500/10 text-red-300"
                : "border-brand/30 bg-brand/10 text-brand-light"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
