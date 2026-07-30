"use client";

import { Menu } from "lucide-react";

interface TopbarProps {
  activeItem: string;
  onMenuClick: () => void;
}

export default function Topbar({ activeItem, onMenuClick }: TopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="text-muted md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="font-display text-base font-semibold text-ink">
          {activeItem}
        </h1>
      </div>

      <div
        className="h-9 w-9 rounded-full border border-border bg-background"
        aria-hidden="true"
      />
    </header>
  );
}