import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 关键修复：等待 params 解析
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, published } = body;

    // 验证数据
    if (!title || !content) {
      return NextResponse.json(
        { error: "标题和内容不能为空" },
        { status: 400 }
      );
    }

    // 更新文章（使用解析后的 id）
    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: {
        title,
        content,
        excerpt,
        published,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("更新文章失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 关键修复：等待 params 解析
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    // 检查文章是否存在
    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      return NextResponse.json({ error: "文章未找到" }, { status: 404 });
    }

    // 删除文章（使用解析后的 id）
    await prisma.post.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "文章删除成功" }, { status: 200 });
  } catch (error) {
    console.error("删除文章失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
