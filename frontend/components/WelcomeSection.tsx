export default function WelcomeSection() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Welcome back
        </h2>
        <p className="mt-1 font-body text-sm text-muted">
          Today&apos;s disaster intelligence overview.
        </p>
      </div>

      <span className="font-mono text-sm text-muted">{today}</span>
    </div>
  );
}