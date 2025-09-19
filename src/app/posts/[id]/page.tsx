import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

// 定义页面参数类型
interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  // 先await params再使用其属性
  const { id } = await params;

  // 从数据库获取文章数据
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: true,
    },
  });

  // 如果文章不存在或未发布，返回 404
  if (!post || !post.published) {
    notFound();
  }

  return (
    <>
      {/* 面包屑导航 */}
      <nav className="mb-8">
        <Link href="/" className="text-color font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
      </nav>

      {/* 文章头部信息 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-color mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <span>作者：{post.author.name || post.author.username}</span>
          <span>•</span>
          <span>
            发布时间：{new Date(post.createdAt).toLocaleDateString("zh-CN")}
          </span>
          <span>•</span>
          <span>
            更新时间：{new Date(post.updatedAt).toLocaleDateString("zh-CN")}
          </span>
        </div>
      </header>

      {/* 文章内容 - 使用Markdown渲染 */}
      <article className="bg-background rounded-lg shadow-md border border-color p-8">
        <div className="prose prose-lg max-w-none text-color">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </>
  );
}
