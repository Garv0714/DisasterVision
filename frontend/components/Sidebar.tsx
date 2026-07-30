"use client";

import { X } from "lucide-react";

import { NAV_ITEMS } from "@/constants/navigation";

interface SidebarProps {
  activeItem: string;
  onSelect: (label: string) => void;
  isMobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  activeItem,
  onSelect,
  isMobileOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-border bg-surface md:static md:z-auto md:flex ${
          isMobileOpen ? "flex" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            DisasterVision
          </span>

          <button
            type="button"
            onClick={onClose}
            className="text-muted md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = item.label === activeItem;
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onSelect(item.label)}
                className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-left font-body text-sm font-medium ${
                  isActive
                    ? "border-signal bg-background text-ink"
                    : "border-transparent text-muted hover:bg-background hover:text-ink"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}