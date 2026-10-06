export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="mb-6 h-8 w-48 rounded-lg bg-black/5" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 rounded-[var(--radius-card)] bg-black/5" />
        ))}
      </div>
      <div className="mt-6 h-80 rounded-[var(--radius-card)] bg-black/5" />
    </div>
  );
}
