import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "DisasterVision",
  description:
    "Post-disaster damage assessment platform using before-and-after satellite imagery for operational decision support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background font-body text-ink antialiased">
        {children}
      </body>
    </html>
  );
}