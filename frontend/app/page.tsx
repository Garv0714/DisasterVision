"use client";

import { useEffect, useState } from "react";

import AppShell from "@/components/AppShell";
import { getHealth } from "@/services/api";

type BackendStatus = "checking" | "online" | "offline";

export default function Home() {
  const [backendStatus, setBackendStatus] =
    useState<BackendStatus>("checking");

  useEffect(() => {
    let isMounted = true;

    async function checkBackendStatus() {
      try {
        await getHealth();

        if (isMounted) {
          setBackendStatus("online");
        }
      } catch {
        if (isMounted) {
          setBackendStatus("offline");
        }
      }
    }

    checkBackendStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h2 className="font-display text-3xl font-semibold text-ink">
            Dashboard
          </h2>

          <p className="mt-3 max-w-2xl font-body text-base text-muted">
            Welcome to DisasterVision. This application shell will host future
            disaster assessment workflows.
          </p>
        </div>

        <section className="rounded-lg border border-border bg-surface p-6">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
            System Status
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                backendStatus === "online"
                  ? "bg-geo"
                  : backendStatus === "offline"
                    ? "bg-signal"
                    : "bg-border"
              }`}
            />

            <span className="font-body text-sm font-medium text-ink">
              Backend
            </span>

            <span className="font-mono text-sm text-muted">
              {backendStatus === "checking" && "Checking..."}
              {backendStatus === "online" && "Online"}
              {backendStatus === "offline" && "Offline"}
            </span>
          </div>
        </section>
      </div>
    </AppShell>
  );
}