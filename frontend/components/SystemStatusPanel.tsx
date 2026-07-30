"use client";

import { useEffect, useState } from "react";

import { SYSTEM_COMPONENTS } from "@/constants/dashboard";
import { getHealth } from "@/services/api";

type BackendStatus = "checking" | "online" | "offline";

export default function SystemStatusPanel() {
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
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h3 className="font-display text-base font-semibold text-ink">
        System Status
      </h3>

      <ul className="mt-4 flex flex-col gap-3">
        <li className="flex items-center justify-between">
          <span className="font-body text-sm text-ink">Backend</span>
          <span className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                backendStatus === "online"
                  ? "bg-geo"
                  : backendStatus === "offline"
                    ? "bg-signal"
                    : "bg-border"
              }`}
            />
            <span className="font-mono text-xs text-muted">
              {backendStatus === "checking" && "Checking..."}
              {backendStatus === "online" && "Online"}
              {backendStatus === "offline" && "Offline"}
            </span>
          </span>
        </li>

        {SYSTEM_COMPONENTS.map((component) => (
          <li
            key={component.label}
            className="flex items-center justify-between"
          >
            <span className="font-body text-sm text-ink">
              {component.label}
            </span>
            <span className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  component.online ? "bg-geo" : "bg-signal"
                }`}
              />
              <span className="font-mono text-xs text-muted">
                {component.online ? "Online" : "Offline"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}