import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  message: string;
  onCreateAnother: () => void;
}

export default function SuccessMessage({
  message,
  onCreateAnother,
}: SuccessMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white py-16 px-6 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900">{message}</p>
        <p className="mt-1 text-sm text-slate-500">
          You can start a new assessment at any time.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreateAnother}
        className="mt-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Start Another Assessment
      </button>
    </div>
  );
}