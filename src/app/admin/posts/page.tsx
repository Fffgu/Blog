import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeletePostButton from "@/components/DeletePostButton";

export default async function PostsManagePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // 获取所有文章
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-color">文章管理</h1>
          <p className="text-gray-600 mt-2">管理您的所有文章</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          写新文章
        </Link>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg shadow-md border border-color p-4">
          <h3 className="text-sm font-medium text-gray-500">总文章数</h3>
          <p className="text-2xl font-bold text-color">{posts.length}</p>
        </div>
        <div className="bg-background rounded-lg shadow-md border border-color p-4">
          <h3 className="text-sm font-medium text-gray-500">已发布</h3>
          <p className="text-2xl font-bold text-green-600">
            {posts.filter((post) => post.published).length}
          </p>
        </div>
        <div className="bg-background rounded-lg shadow-md border border-color p-4">
          <h3 className="text-sm font-medium text-gray-500">草稿</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {posts.filter((post) => !post.published).length}
          </p>
        </div>
        <div className="bg-background rounded-lg shadow-md border border-color p-4">
          <h3 className="text-sm font-medium text-gray-500">本月更新</h3>
          <p className="text-2xl font-bold text-blue-600">
            {
              posts.filter((post) => {
                const now = new Date();
                const postDate = new Date(post.updatedAt);
                return (
                  postDate.getMonth() === now.getMonth() &&
                  postDate.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </p>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="bg-background rounded-lg shadow-md border border-color">
        <div className="p-6 border-b border-color">
          <h2 className="text-xl font-semibold text-color">所有文章</h2>
        </div>

        {posts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-6 hover:hover-color transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-color">
                        {post.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "已发布" : "草稿"}
                      </span>
                    </div>

                    {post.excerpt && (
                      <p className="text-color text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>
                        作者：{post.author.name || post.author.username}
                      </span>
                      <span>
                        创建：
                        {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                      <span>
                        更新：
                        {new Date(post.updatedAt).toLocaleDateString("zh-CN")}
                      </span>
                      <span>字数：{post.content.length}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {post.published && (
                      <Link
                        href={`/posts/${post.id}`}
                        target="_blank"
                        className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 border border-green-200 rounded hover:bg-green-50 transition-colors"
                      >
                        查看
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                    >
                      编辑
                    </Link>
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-color mb-2">
              还没有任何文章
            </h3>
            <p className="text-gray-600 mb-6">开始创建您的第一篇文章吧！</p>
            <Link
              href="/admin/posts/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              写新文章
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
