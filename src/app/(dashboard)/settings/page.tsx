"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { User, Mail, Lock, Camera, Loader2, Check, AlertCircle } from "lucide-react";

export default function Settings() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    avatarUrl: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          fullName: user.user_metadata?.full_name || "",
          email: user.email || "",
          avatarUrl: user.user_metadata?.avatar_url || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          avatar_url: profile.avatarUrl,
        },
      });

      if (error) throw error;
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: "error", text: "New passwords don't match" });
      return;
    }

    if (passwords.new.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setChangingPassword(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      });

      if (error) throw error;

      setPasswords({ current: "", new: "", confirm: "" });
      setMessage({ type: "success", text: "Password changed successfully!" });
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({ type: "error", text: err.message || "Failed to change password" });
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <h2 className="text-lg font-semibold text-zinc-900">Profile</h2>
              <p className="text-sm text-zinc-500">Your personal information</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(profile.fullName)}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-zinc-200 rounded-full flex items-center justify-center shadow-sm hover:bg-zinc-50 transition-colors">
                    <Camera className="w-4 h-4 text-zinc-600" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-zinc-900">{profile.fullName || "Your Name"}</p>
                  <p className="text-sm text-zinc-500">{profile.email}</p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={profile.avatarUrl}
                  onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <h2 className="text-lg font-semibold text-zinc-900">Change Password</h2>
              <p className="text-sm text-zinc-500">Update your password to keep your account secure</p>
            </div>

            <div className="p-6 space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Must be at least 6 characters
                </p>
              </div>

              {/* Change Password Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword || !passwords.new || !passwords.confirm}
                  className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-200 bg-red-50">
              <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
              <p className="text-sm text-red-600">Irreversible actions</p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900">Delete Account</p>
                  <p className="text-sm text-zinc-500">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
