import type { Metadata } from "next";
import "./globals.css";

const APP_NAME = "StreamSphere";

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "Upload video content to Cloudflare and stream it securely to your audience.",
  applicationName: APP_NAME
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
