"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

// 动态导入 MDEditor 以避免 SSR 问题
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export interface Post {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
}

interface PostEditorProps {
  post?: Post;
  onSave: (post: Omit<Post, "id">) => Promise<void>;
  isLoading?: boolean;
}

export default function PostEditor({
  post,
  onSave,
  isLoading = false,
}: PostEditorProps) {
  const { theme } = useTheme();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [published, setPublished] = useState(post?.published || false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async (shouldPublish?: boolean) => {
    if (!title.trim()) {
      alert("请输入文章标题");
      return;
    }

    if (!content.trim()) {
      alert("请输入文章内容");
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim(), // 不再自动生成摘要
        published: shouldPublish !== undefined ? shouldPublish : published,
      });
    } catch (error) {
      console.error("保存失败:", error);
      if (
        !(error instanceof Error && error.message.includes("NEXT_REDIRECT"))
      ) {
        alert("保存失败，请重试");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题输入 */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-color mb-2"
        >
          文章标题 *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入文章标题"
          className="bg-background w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-color"
        />
      </div>

      {/* 摘要输入 */}
      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-color mb-2"
        >
          文章摘要
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="请输入文章摘要"
          rows={3}
          className="bg-background w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-color resize-none"
        />
        <p className="mt-1 text-sm text-gray-500">{excerpt.length}/150 字符</p>
      </div>

      {/* Markdown 编辑器 */}
      <div>
        <label className="block text-sm font-medium text-color mb-2">
          文章内容 *
        </label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || "")}
            preview="edit"
            height={500}
            data-color-mode={theme === "dark" ? "dark" : "light"}
          />
        </div>
      </div>

      {/* 发布状态 */}
      <div className="flex items-center space-x-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="published" className="text-sm font-medium text-color">
          立即发布文章
        </label>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-6 border-t border-color">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 text-color rounded-lg hover:hover-color transition-colors"
        >
          取消
        </button>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving || isLoading}
            className="px-6 py-2 border border-gray-300 text-color rounded-lg hover:hover-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? "保存中..." : "保存草稿"}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? "发布中..." : "发布文章"}
          </button>
        </div>
      </div>
    </div>
  );
}
