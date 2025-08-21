import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // 获取已发布的文章，按创建时间倒序
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      {/* 首页欢迎区域 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-color mb-4">欢迎来到我的博客</h1>
        <p className="text-xl text-gray-600">
          在这里分享技术学习心得和生活感悟
        </p>
      </div>

      {/* 文章列表 */}
      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-background rounded-lg shadow-md border border-color p-8 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-color mb-2">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>作者：{post.author.name || post.author.username}</span>
                  <span>
                    发布时间：
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>

              {post.excerpt && (
                <p className="text-color leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              )}

              <Link
                href={`/posts/${post.id}`}
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                阅读全文
              </Link>
            </article>
          ))
        ) : (
          <div className="bg-background rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-color mb-4">暂无文章</h2>
            <p className="text-gray-600">
              还没有发布任何文章，请稍后再来查看。
            </p>
          </div>
        )}
      </div>
    </>
  );
}
