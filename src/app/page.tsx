export default function Home() {
  const features = [
    {
      title: "Zutaten analysieren & veganes Rezept erhalten",
      description:
        "Lade ein Foto hoch, wir extrahieren automatisch die Zutaten und generieren ein kreatives, veganes Rezept inklusive Zubereitungsschritten.",
      href: "/upload",
      cta: "Zum Rezept-Generator",
    },
    {
      title: "Bestehendes Gericht veganisieren",
      description:
        "Dein Lieblingsgericht enthält noch tierische Produkte? Analysiere das Bild und erhalte Ersatzvorschläge sowie einen klaren Umsetzungsplan.",
      href: "/veganize",
      cta: "Gericht veganisieren",
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12">
      <section className="space-y-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wide text-highlight">
          KI für vegane Küche
        </span>
        <h1 className="text-balance text-4xl font-semibold leading-tight text-primary md:text-5xl">
          Deine Abkürzung von Foto zu veganem Lieblingsgericht.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-primary/80">
          Egal ob du neue vegane Rezepte entdecken oder ein bestehendes Gericht anpassen möchtest – veganeWunder analysiert deine Bilder und liefert dir
          sekundenschnell die passenden Zutaten, Ideen und Schritt-für-Schritt-Anleitungen.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <a
            key={feature.title}
            href={feature.href}
            className="group relative overflow-hidden rounded-3xl border border-accent bg-background/80 p-8 shadow-sm transition hover:shadow-lg"
          >
            <div className="absolute -right-14 top-10 h-32 w-32 rounded-full bg-highlight/10 blur-3xl transition group-hover:bg-highlight/20" />
            <div className="absolute -left-16 bottom-6 h-28 w-28 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />
            <div className="relative space-y-4">
              <h2 className="text-xl font-semibold text-primary">{feature.title}</h2>
              <p className="text-sm text-primary/75">{feature.description}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-highlight">
                {feature.cta}
                <span aria-hidden>→</span>
              </span>
            </div>
          </a>
        ))}
      </section>

      <section className="rounded-3xl border border-accent bg-background/70 p-8 shadow-inner">
        <h2 className="text-center text-2xl font-semibold text-primary">So funktioniert es</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="space-y-2 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-highlight text-sm font-semibold text-white">
              1
            </span>
            <h3 className="text-lg font-semibold text-primary">Foto hochladen</h3>
            <p className="text-sm text-primary/70">Nutze Drag & Drop, Kamera oder Dateiupload – ganz wie es dir passt.</p>
          </div>
          <div className="space-y-2 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-highlight text-sm font-semibold text-white">
              2
            </span>
            <h3 className="text-lg font-semibold text-primary">Zutaten verstehen</h3>
            <p className="text-sm text-primary/70">Unsere KI erkennt die wichtigsten Ingredienzen und berücksichtigt Unverträglichkeiten.</p>
          </div>
          <div className="space-y-2 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-highlight text-sm font-semibold text-white">
              3
            </span>
            <h3 className="text-lg font-semibold text-primary">Veganes Ergebnis erhalten</h3>
            <p className="text-sm text-primary/70">Entweder ein frisches Rezept oder eine Anleitung zur Veganisierung deines Gerichts.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
