import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // 获取用户完整信息
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-8 ">
      <div>
        <h1 className="text-3xl font-bold text-color mb-2">个人设置</h1>
        <p className="text-gray-600">管理您的个人信息和账户设置</p>
      </div>

      <div className="bg-background rounded-lg shadow-md border border-color p-6">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
