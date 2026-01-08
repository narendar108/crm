"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Logo from "./Logo";
import {
  LayoutDashboard,
  Kanban,
  Users,
  Building2,
  CheckSquare,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pipeline", href: "/pipeline", icon: Kanban },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Activities", href: "/activities", icon: CheckSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-zinc-900">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-zinc-800">
        <Logo size="sm" variant="light" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-zinc-800 p-4 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
