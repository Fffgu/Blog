import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-color mb-4">文章未找到</h2>
        <p className="text-gray-600 mb-8">
          抱歉，您访问的文章不存在或已被删除。
        </p>
      </div>

      <div className="space-x-4">
        <Link
          href="/"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          返回首页
        </Link>
        <Link
          href="/about"
          className="inline-flex items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:hover-color transition-colors"
        >
          关于我们
        </Link>
      </div>
    </div>
  );
}
