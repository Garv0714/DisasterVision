import { Loader2 } from "lucide-react";

interface UploadProgressProps {
  message?: string;
}

export default function UploadProgress({
  message = "Preparing assessment...",
}: UploadProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white py-16 shadow-sm">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <Loader2 className="h-14 w-14 animate-spin text-blue-500" />
      </div>
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}