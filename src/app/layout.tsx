import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signal Desk",
  description: "Independent news, edited with care."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
