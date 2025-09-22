import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostEditor from "@/components/PostEditor";

// ✅ 导入 Post 类型（来自组件）
import { Post } from "@/components/PostEditor";

// ✅ 定义创建文章所需的完整输入类型
type CreatePostInput = Omit<Post, "id"> & { authorId: string };

// ✅ 创建文章的服务器动作
async function createPost(data: CreatePostInput) {
  "use server";

  const post = await prisma.post.create({
    data,
  });

  redirect(`/admin/posts/${post.id}/edit`);
}

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // ✅ 保持与 PostEditor 的 onSave 类型完全一致
  const handleSave = async (postData: Omit<Post, "id">) => {
    "use server";

    await createPost({
      ...postData,
      authorId: session.user.id, // ✅ 手动注入作者 ID
    });
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-color mb-2">写新文章</h1>
        <p className="text-gray-600">创建一篇新的博客文章</p>
      </div>

      <div className="bg-background rounded-lg shadow-md border border-color p-8 max-w-4xl mx-auto">
        <PostEditor onSave={handleSave} />
      </div>
    </div>
  );
}
