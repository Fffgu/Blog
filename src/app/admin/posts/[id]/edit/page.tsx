import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostEditor from "@/components/PostEditor";
import { Metadata } from "next";

// 假设从PostEditor导入Post类型，或者在这里定义
import { Post } from "@/components/PostEditor"; // 调整实际导入路径

// 定义动态路由参数类型
interface EditPostParams {
  id: string;
}

// 页面组件接收的props类型
interface EditPostPageProps {
  params: EditPostParams;
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

// 服务器操作：更新文章
async function updatePost(
  id: string,
  data: Omit<Post, "id"> // 使用与组件匹配的类型
) {
  "use server";

  await prisma.post.update({
    where: { id },
    data,
  });

  redirect("/admin/posts");
}

// 生成页面元数据
export async function generateMetadata({
  params,
}: EditPostPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: { title: true },
  });

  return {
    title: `编辑文章: ${post?.title || params.id}`,
    description: `修改文章 "${post?.title || params.id}" 的内容`,
  };
}

// 页面组件
export default async function EditPostPage({ params }: EditPostPageProps) {
  if (!params || typeof params.id !== "string") {
    notFound();
  }

  const { id } = params;

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

  // 调整handleSave参数类型以匹配PostEditor的要求
  const handleSave = async (postData: Omit<Post, "id">) => {
    "use server";
    await updatePost(id, postData); // 这里使用路由中的id，而不是postData中的id
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
          onSave={handleSave} // 现在类型匹配了
        />
      </div>
    </div>
  );
}
