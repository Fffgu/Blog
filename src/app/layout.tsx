// 修改 src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import RootLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "FeiGu's Blog",
  description: "Blog app built with Next.js",
  icons: {
    icon: "/icons/image.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh" className="tc-new-price">
      <body className="antialiased bg-background text-color min-h-screen">
        {/* 关键修复：先加载 Providers（包含 SessionProvider），再加载布局内容 */}
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
