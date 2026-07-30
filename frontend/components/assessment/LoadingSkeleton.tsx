interface LoadingSkeletonProps {
  rows?: number;
}

export default function LoadingSkeleton({ rows = 6 }: LoadingSkeletonProps) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0"
        >
          <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="ml-auto h-3 w-24 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}