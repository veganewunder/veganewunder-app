import UploadForm from "@/modules/upload/components/UploadForm";

const steps = [
  {
    title: "Bild hochladen",
    description: "Foto eines Produktes oder Gerichtes hinzufügen. Unterstützt JPG, PNG und HEIC.",
  },
  {
    title: "Zutaten erkennen",
    description: "Unsere KI extrahiert automatisch die wichtigsten Zutaten aus dem Bild.",
  },
  {
    title: "Veganes Rezept erhalten",
    description: "Du erhältst eine kreative vegane Rezeptidee inklusive Zubereitungsschritten.",
  },
];

export default function UploadPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wide text-highlight">
            Neue Funktion
          </span>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-primary md:text-5xl">
            Aus Foto wird vegane Rezeptidee – in wenigen Sekunden.
          </h1>
          <p className="max-w-xl text-lg text-primary/80">
            Lade ein Foto hoch, analysiere die enthaltenen Zutaten und lass dir automatisch ein kreatives, veganes Rezept generieren.
            Modern, minimalistisch und ganz ohne manuellen Aufwand.
          </p>

          <div className="grid gap-4 rounded-3xl border border-accent bg-background/70 p-6 shadow-sm sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-highlight">{step.title}</h3>
                <p className="text-sm text-primary/75">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <UploadForm />
      </section>

      <section className="rounded-3xl border border-accent bg-background/70 p-10 shadow-inner">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold text-primary">Schnell & intuitiv</h2>
            <p className="mt-2 text-sm text-primary/70">
              Minimaler Input, maximaler Output: Du brauchst nur ein Foto – den Rest übernimmt die KI.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary">Vegan by default</h2>
            <p className="mt-2 text-sm text-primary/70">
              Die Rezeptvorschläge sind konsequent pflanzlich, saisonal inspirierend und variabel.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary">Teilen & Speichern</h2>
            <p className="mt-2 text-sm text-primary/70">
              Speichere deine Lieblingsrezepte oder teile sie direkt mit Freund:innen.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
