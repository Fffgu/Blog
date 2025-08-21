import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostEditor from "@/components/PostEditor";

async function createPost(data: {
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  authorId: string;
}) {
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

  const handleSave = async (postData: {
    title: string;
    content: string;
    excerpt: string;
    published: boolean;
  }) => {
    "use server";

    await createPost({
      ...postData,
      authorId: session.user.id,
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
