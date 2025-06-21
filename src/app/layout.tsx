import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Route Generator",
  description: "出発地、経由地、目的地を設定して、Google Mapsの経路URLを生成するアプリです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-800">
        <Header />
        <main className="pt-14 pb-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
