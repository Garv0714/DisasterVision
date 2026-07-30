const NAV_ITEMS = ["Dashboard", "Analysis", "Reports"] as const;

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          DisasterVision
        </span>

        <nav className="hidden gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <span
              key={item}
              className="font-body text-sm font-medium text-muted"
            >
              {item}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}
