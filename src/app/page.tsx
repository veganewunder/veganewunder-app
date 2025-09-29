const actions = [
  {
    href: "/upload",
    label: "Zutaten → Rezept",
    description:
      "Foto hochladen, Zutaten extrahieren lassen und in wenigen Augenblicken ein veganes Rezept erhalten.",
    accent: "from-highlight/20 via-highlight/10 to-transparent",
    badge: "Rezeptgenerator",
    emoji: "🥗",
  },
  {
    href: "/veganize",
    label: "Gericht veganisieren",
    description:
      "Analyse deines Lieblingsgerichts, smarte Alternativen und ein Fahrplan für die vegane Variante.",
    accent: "from-primary/20 via-primary/10 to-transparent",
    badge: "Veganisierung",
    emoji: "🌱",
  },
];

export default function Home() {
  return (
    <main className="relative mx-auto w-full max-w-4xl px-4 pb-16 pt-20 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-highlight/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-10 h-52 w-52 rounded-full bg-primary/15 blur-[110px]" />
      </div>

      <section className="space-y-6 rounded-3xl border border-accent/60 bg-background/90 p-10 text-center shadow-xl shadow-primary/5 backdrop-blur">
        <span className="inline-flex items-center gap-2 rounded-full bg-highlight/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-highlight">
          Sofort loslegen
        </span>
        <h1 className="text-3xl font-semibold leading-snug text-primary sm:text-4xl">
          Von deinem Foto zum veganen Ergebnis – in wenigen Sekunden
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-primary/70 sm:text-base">
          Unsere KI erkennt Zutaten, berücksichtigt Unverträglichkeiten und liefert dir entweder ein neues Rezept
          oder eine vegane Variante deines Lieblingsgerichts. Wähle den Flow, der zu deiner Idee passt.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {actions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="group relative overflow-hidden rounded-2xl border border-accent/60 bg-background px-6 py-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.accent} opacity-70 transition group-hover:opacity-100`} />
              <div className="relative space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary/70">
                  {action.emoji} {action.badge}
                </span>
                <h2 className="text-xl font-semibold text-primary">{action.label}</h2>
                <p className="text-sm text-primary/75">{action.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-highlight">
                  Flow öffnen
                  <span aria-hidden>→</span>
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="text-xs text-primary/60">
          Unterstützung für Drag & Drop, Kamera-Upload und eine direkte Anbindung an OpenAI – ganz ohne Setup.
        </p>
      </section>
    </main>
  );
}
