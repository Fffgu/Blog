import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostEditor from "@/components/PostEditor";
import { Metadata } from "next";

// 假设从PostEditor导入Post类型
import { Post } from "@/components/PostEditor";

// ✅ 删除自定义的 EditPostPageProps，改用官方类型
// Next.js 15 中，params 和 searchParams 都是 Promise
export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ 关键：必须是 Promise
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // ✅ 用 await 解构 params
  const resolvedParams = await params;
  if (!resolvedParams || typeof resolvedParams.id !== "string") {
    notFound();
  }

  const { id } = resolvedParams;

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  const handleSave = async (postData: Omit<Post, "id">) => {
    "use server";
    await prisma.post.update({
      where: { id },
      data: postData,
    });
    redirect("/admin/posts");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-color mb-2">编辑文章</h1>
        <p className="text-gray-600">修改文章内容和设置</p>
      </div>

      <div className="bg-background rounded-lg shadow-md border border-color p-8">
        <PostEditor
          post={{
            id: post.id,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || "",
            published: post.published,
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { id: resolvedParams.id },
    select: { title: true },
  });

  return {
    title: `编辑文章: ${post?.title || resolvedParams.id}`,
    description: `修改文章 "${post?.title || resolvedParams.id}" 的内容`,
  };
}
