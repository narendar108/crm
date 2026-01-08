"use client";

import { Bell, Search, Plus } from "lucide-react";
import { useState } from "react";

type HeaderProps = {
  title: string;
  onAddNew?: () => void;
  addNewLabel?: string;
};

export default function Header({ title, onAddNew, addNewLabel }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9 pr-4 py-2 bg-zinc-100 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Add New Button */}
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {addNewLabel || "Add New"}
          </button>
        )}
      </div>
    </header>
  );
}
