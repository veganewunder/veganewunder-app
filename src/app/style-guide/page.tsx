export default function StyleGuide() {
  const swatches = [
    { name: "primary", cls: "bg-primary" },
    { name: "background", cls: "bg-background" },
    { name: "accent", cls: "bg-accent" },
    { name: "highlight", cls: "bg-highlight" },
  ];

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Style Guide</h1>
      <div className="grid grid-cols-2 gap-4">
        {swatches.map((s) => (
          <div
            key={s.name}
            className={`h-20 rounded-lg shadow ${s.cls} flex items-center justify-center`}
          >
            <span className="bg-white/80 px-2 py-0.5 rounded text-sm">
              {s.name}
            </span>
          </div>
        ))}
      </div>

      <button className="px-4 py-2 rounded bg-highlight text-white hover:bg-primary transition">
        Beispiel-Button
      </button>

      <div className="p-4 border border-accent rounded bg-white/60">
        <p>
          Box mit <code>border-accent</code> &amp; neutralem Hintergrund.
        </p>
      </div>
    </main>
  );
}
