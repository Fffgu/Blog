// 修改 src/app/layout-client.tsx
"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";

// 注意：这里移除 Providers 导入，改为直接接收 children

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  // 现在 useSession 处于 SessionProvider 内部了
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 网站头部 */}
      <header className="bg-background shadow-lg border-b-2 border-color ">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-black text-color">
              肥古的博客
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-color font-semibold hover:hover-color p-2 rounded transition-colors"
              >
                首页
              </Link>
              <Link
                href="/about"
                className="text-color font-semibold hover:hover-color p-2 rounded transition-colors"
              >
                关于我
              </Link>
              {session ? (
                <Link
                  href="/admin"
                  className="text-color font-semibold hover:hover-color p-2 rounded transition-colors"
                >
                  管理后台
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-color font-semibold hover:hover-color p-2 rounded transition-colors"
                >
                  登录
                </Link>
              )}
              {session && <ThemeToggle />}
            </div>
          </nav>
        </div>
      </header>

      {/* 页面内容 */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">{children}</main>

      {/* 页脚 */}
      <footer className="bg-background border-t-2 border-color mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-color font-medium">
          <p>&copy; 2025 肥古的博客.</p>
        </div>
      </footer>
    </div>
  );
}
