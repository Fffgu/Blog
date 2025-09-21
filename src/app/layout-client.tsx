// 修改 src/app/layout-client.tsx
"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 网站头部 */}
      <header className="bg-background shadow-lg border-b-2 border-color ">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-black text-color">
              肥古的博客
            </Link>
            <div className="flex items-center space-x-6">
              {/* 始终显示首页链接 */}
              <Link
                href="/"
                className="text-color font-semibold hover:hover-color p-2 rounded transition-colors"
              >
                首页
              </Link>

              {/* 始终显示关于我链接 */}
              <Link
                href="/about"
                className="text-color font-semibold hover:hover-color p-2 rounded transition-colors"
              >
                关于我
              </Link>

              {/* 登录状态下显示管理文章链接 */}
              {session && (
                <Link
                  href="/admin/posts"
                  className="text-color font-semibold hover:hover-color p-2 rounded transition-colors"
                >
                  管理后台
                </Link>
              )}

              {/* 无论登录状态都显示主题切换按钮 */}
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* 页面内容 */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-background border-t-2 border-color mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-color font-medium">
          <p>&copy; 2025 肥古的博客.</p>
        </div>
      </footer>
    </div>
  );
}
