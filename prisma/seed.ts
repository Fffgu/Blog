import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 创建管理员用户
  const hashedPassword = await bcrypt.hash("123456", 12);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "博客管理员",
      bio: "欢迎来到我的个人博客！这里分享技术学习心得和生活感悟。",
    },
  });

  console.log("创建管理员用户:", admin);

  // 创建示例文章
  const posts = [
    {
      id: "1", // 添加唯一id
      title: "欢迎来到我的博客",
      content: `# 欢迎来到我的博客...`,
      excerpt: "欢迎来到我的个人博客！这里将分享技术学习心得和生活感悟。",
      published: true,
      authorId: admin.id,
    },
    {
      id: "2", // 添加唯一id
      title: "Next.js 13 新特性介绍",
      content: `# Next.js 13 新特性介绍...`,
      excerpt:
        "探索 Next.js 13 的新特性：App Router、Server Components 和 Turbopack。",
      published: true,
      authorId: admin.id,
    },
    {
      id: "3", // 添加唯一id
      title: "TypeScript 最佳实践",
      content: `# TypeScript 最佳实践...`,
      excerpt: "分享一些 TypeScript 开发中的最佳实践和编码规范。",
      published: false,
      authorId: admin.id,
    },
  ];

  for (const postData of posts) {
    const post = await prisma.post.upsert({
      where: {
        id: postData.id, // 这里使用id作为唯一标识
      },
      update: {},
      create: postData,
    });
    console.log("创建文章:", post.title);
  }

  console.log("种子数据创建完成！");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
