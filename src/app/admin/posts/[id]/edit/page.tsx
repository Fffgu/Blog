import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostEditor from "@/components/PostEditor";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

async function updatePost(
  id: string,
  data: {
    title: string;
    content: string;
    excerpt: string;
    published: boolean;
  }
) {
  "use server";

  await prisma.post.update({
    where: { id },
    data,
  });

  redirect("/admin/posts");
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  // 关键修复：等待 params 解析
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // 获取文章数据（使用解析后的 id）
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: true,
    },
  });

  if (!post) {
    notFound();
  }

  const handleSave = async (postData: {
    title: string;
    content: string;
    excerpt: string;
    published: boolean;
  }) => {
    "use server";
    // 使用解析后的 id
    await updatePost(id, postData);
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
