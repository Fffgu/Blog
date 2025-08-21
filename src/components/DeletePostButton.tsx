"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
}

export default function DeletePostButton({
  postId,
  postTitle,
}: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`确定要删除文章"${postTitle}"吗？此操作不可恢复。`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh(); // 刷新页面数据
      } else {
        const error = await response.json();
        alert(`删除失败: ${error.error}`);
      }
    } catch (error) {
      console.error("删除文章失败:", error);
      alert("删除失败，请重试");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 border border-red-200 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isDeleting ? "删除中..." : "删除"}
    </button>
  );
}
