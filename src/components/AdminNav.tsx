"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = () => {
    if (confirm("确定要退出登录吗？")) {
      signOut({ callbackUrl: "/" });
    }
  };

  const navItems = [
    { href: "/admin", label: "仪表板", icon: "📊" },
    { href: "/admin/posts", label: "文章管理", icon: "📝" },
    { href: "/admin/profile", label: "个人设置", icon: "⚙️" },
  ];

  return (
    <nav className="bg-background border-b border-color mb-1">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* 左侧导航 */}
          <div className="flex items-center space-x-6">
            <Link
              href="/admin"
              className="text-xl font-bold text-color hover:text-blue-600 transition-colors"
            >
              管理后台
            </Link>

            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-color hover:hover-color"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 右侧用户信息 */}
          <div className="flex items-center space-x-4">
            {session && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSignOut}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 移动端导航 */}
        <div className="md:hidden border-t border-color py-3">
          <div className="flex space-x-4 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-color hover:hover-color"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
