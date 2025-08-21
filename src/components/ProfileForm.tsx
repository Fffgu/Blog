"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  createdAt: Date;
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState(user.bio || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim() || null,
          email: email.trim() || null,
          bio: bio.trim() || null,
        }),
      });

      if (response.ok) {
        setMessage("个人信息更新成功！");
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "更新失败");
      }
    } catch (error) {
      setError("网络错误，请重试");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("新密码与确认密码不匹配");
      return;
    }

    if (newPassword.length < 6) {
      setError("新密码至少需要6个字符");
      return;
    }

    setIsChangingPassword(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setMessage("密码修改成功！");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "密码修改失败");
      }
    } catch (error) {
      setError("网络错误，请重试");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 消息提示 */}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 基本信息 */}
      <div className=" border-b border-color pb-8">
        <h2 className="text-xl font-semibold text-color mb-6">基本信息</h2>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-color mb-2">
                用户名
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-background text-color cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-gray-500">用户名不可修改</p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-color mb-2"
              >
                显示名称
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入显示名称"
                className="w-full px-3 py-2 border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-color"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-color mb-2"
            >
              邮箱地址
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱地址"
              className="w-full px-3 py-2 border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-color"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-color mb-2"
            >
              个人简介
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="介绍一下自己吧..."
              rows={4}
              className="w-full px-3 py-2 border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-color resize-none"
            />
            <p className="mt-1 text-sm text-gray-500">{bio.length}/500 字符</p>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              账户创建时间：{new Date(user.createdAt).toLocaleString("zh-CN")}
            </p>
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdatingProfile ? "更新中..." : "更新信息"}
          </button>
        </form>
      </div>

      {/* 密码修改 */}
      <div>
        <h2 className="text-xl font-semibold text-color mb-6">修改密码</h2>

        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-color mb-2"
            >
              当前密码 *
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-color"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-color mb-2"
            >
              新密码 *
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-color"
            />
            <p className="mt-1 text-sm text-gray-500">至少6个字符</p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-color mb-2"
            >
              确认新密码 *
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-color"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isChangingPassword ? "修改中..." : "修改密码"}
          </button>
        </form>
      </div>
    </div>
  );
}
