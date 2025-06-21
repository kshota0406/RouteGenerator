import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Maps Route Generator",
  description: "出発地、経由地、目的地を設定して、Google Mapsの経路URLを生成するアプリです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
