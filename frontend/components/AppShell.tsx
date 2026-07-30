"use client";

import { useState } from "react";

import { NAV_ITEMS } from "@/constants/navigation";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [activeItem, setActiveItem] = useState<string>(NAV_ITEMS[0].label);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeItem={activeItem}
        onSelect={(label) => {
          setActiveItem(label);
          setIsMobileNavOpen(false);
        }}
        isMobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar
          activeItem={activeItem}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}