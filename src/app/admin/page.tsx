import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // 获取所有文章（包括草稿）
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // 统计数据
  const publishedCount = posts.filter((post) => post.published).length;
  const draftCount = posts.filter((post) => !post.published).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 欢迎区域 */}
      <div>
        <h1 className="text-3xl font-bold text-color mb-2">
          欢迎回来，{session.user.name || session.user.username}!
        </h1>
        <p className="text-gray-600">
          这是您的博客管理后台，您可以在这里管理所有文章。
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background rounded-lg shadow-md border border-color p-6">
          <h3 className="text-lg font-semibold text-color mb-2">总文章数</h3>
          <p className="text-3xl font-bold text-blue-600">{posts.length}</p>
        </div>
        <div className="bg-background rounded-lg shadow-md border border-color p-6">
          <h3 className="text-lg font-semibold text-color mb-2">已发布</h3>
          <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
        </div>
        <div className="bg-background rounded-lg shadow-md border border-color p-6">
          <h3 className="text-lg font-semibold text-color mb-2">草稿</h3>
          <p className="text-3xl font-bold text-yellow-600">{draftCount}</p>
        </div>
      </div>

      {/* 最近文章 */}
      <div className="bg-background rounded-lg shadow-md border border-color p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-color">最近更新的文章</h2>
          <Link
            href="/admin/posts"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            查看全部
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 border border-color rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-color">{post.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>
                      状态：
                      <span
                        className={
                          post.published ? "text-green-600" : "text-yellow-600"
                        }
                      >
                        {post.published ? "已发布" : "草稿"}
                      </span>
                    </span>
                    <span>
                      更新时间：
                      {new Date(post.updatedAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    编辑
                  </Link>
                  {post.published && (
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                      target="_blank"
                    >
                      查看
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">还没有任何文章</p>
            <Link
              href="/admin/posts/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              写第一篇文章
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
