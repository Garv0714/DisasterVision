"use client";

import { ArrowRight, FileText } from "lucide-react";
import { useEffect, useState } from "react";

import { getHealth } from "@/services/api";

type BackendStatus = "checking" | "online" | "offline";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>(
    "checking",
  );

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
    <>
      <section className="coordinate-grid border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-geo">
            Operational Decision Support
          </p>

          <h1 className="mt-6 max-w-2xl font-display text-5xl font-semibold tracking-tight text-ink md:text-6xl">
            DisasterVision
          </h1>

          <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-muted">
            A post-disaster damage assessment platform that compares
            before-and-after satellite imagery to support operational
            decisions for emergency response and recovery teams.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-md bg-ink px-6 py-3 font-body text-sm font-medium text-white">
              Launch Platform
              <ArrowRight className="h-4 w-4" />
            </button>

            <button className="flex items-center gap-2 rounded-md border border-border bg-surface px-6 py-3 font-body text-sm font-medium text-ink">
              <FileText className="h-4 w-4" />
              View Documentation
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          System Status
        </p>

        <div className="mt-4 flex items-center gap-3 rounded-md border border-border bg-surface px-5 py-4">
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
    </>
  );
}
