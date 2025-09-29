import VeganizeForm from "@/modules/veganize/components/VeganizeForm";

const highlights = [
  {
    title: "Analyse & Insight",
    description: "Erkenne zuerst, welche Zutaten das Gericht aktuell enthält – automatisch durch KI-Analyse.",
  },
  {
    title: "Vegane Alternativen",
    description: "Erhalte konkrete Ersatzvorschläge für tierische Produkte inklusive kurzer Begründung.",
  },
  {
    title: "Schritt-für-Schritt",
    description: "Ein klarer Fahrplan zeigt dir, wie du das Gericht sofort vegan nachkochen kannst.",
  },
];

export default function VeganizePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wide text-highlight">
            Veganisieren
          </span>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-primary md:text-5xl">
            Verwandle Lieblingsgerichte in vegane Klassiker.
          </h1>
          <p className="max-w-xl text-lg text-primary/80">
            Lade ein Foto eines bestehenden Gerichts hoch – wir identifizieren die Zutaten und zeigen dir, wie du daraus eine vollwertige, vegane Variante zauberst.
          </p>

          <div className="grid gap-4 rounded-3xl border border-accent bg-background/70 p-6 shadow-sm sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-highlight">{item.title}</h3>
                <p className="text-sm text-primary/75">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <VeganizeForm />
      </section>

      <section className="rounded-3xl border border-accent bg-background/70 p-10 shadow-inner">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold text-primary">Klassiker retten</h2>
            <p className="mt-2 text-sm text-primary/70">
              Ob Lasagne, Curry oder Auflauf – du bekommst passende pflanzliche Alternativen ohne Geschmacksverlust.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary">Mehr Nachhaltigkeit</h2>
            <p className="mt-2 text-sm text-primary/70">
              Vermeide tierische Produkte mit einem Klick und entdecke neue Lieblingszutaten.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary">Teilen & Lernen</h2>
            <p className="mt-2 text-sm text-primary/70">
              Speichere Vorschläge oder teile sie mit Freund:innen – perfekt für gemeinsames Kochen.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
