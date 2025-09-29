"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import VeganizePlanCard from "@/modules/veganize/components/VeganizePlanCard";

interface AnalyzeResponse {
  ingredients: { name: string; amount: string }[];
  error?: string;
}

interface VeganizeResponse {
  dish: string;
  overview: string;
  swaps: Array<{
    original: string;
    veganAlternative: string;
    notes?: string;
  }>;
  steps: string[];
  error?: string;
}

type LibraryEntry = {
  title: string;
  description: string;
  href: string;
};

const RECIPE_LIBRARY: Array<{ keywords: string[]; entry: LibraryEntry }> = [
  {
    keywords: ["linsen", "lentil"],
    entry: {
      title: "Linsen-Patty",
      description: "Saftige Patty-Grundlage aus roten Linsen – ideal für Burger & Bowls.",
      href: "https://www.eat-this.org/vegane-linsenburger/",
    },
  },
  {
    keywords: ["kichererb", "chickpea"],
    entry: {
      title: "Kichererbsen-Patty",
      description: "Proteinreicher Patty-Klassiker, knusprig gebacken oder gebraten.",
      href: "https://www.zuckerjagdwurst.com/de/rezepte/vegane-kichererbsen-burger-patties",
    },
  },
  {
    keywords: ["jackfruit"],
    entry: {
      title: "Pulled Jackfruit",
      description: "Rauchig-würzige Jackfruit als Pulled-Pork-Alternative.",
      href: "https://www.eat-this.org/pulled-jackfruit-tacos/",
    },
  },
  {
    keywords: ["seitan"],
    entry: {
      title: "Seitan-Steaks",
      description: "Herzhafte, bissfeste Basis für Pfanne & Grill.",
      href: "https://www.vegan-gesund.de/rezepte/seitan-steaks/",
    },
  },
  {
    keywords: ["cashew", "käse", "cheese"],
    entry: {
      title: "Cashew-Creme",
      description: "Sahnige Alternative zu Frischkäse & Sahne.",
      href: "https://www.veggi.es/vegane-cashew-sahne/",
    },
  },
  {
    keywords: ["hafer", "oat"],
    entry: {
      title: "Hafermilch selber machen",
      description: "In wenigen Minuten zur milden Pflanzenmilch.",
      href: "https://www.zuckerjagdwurst.com/de/rezepte/hafermilch-selber-machen",
    },
  },
];

export default function VeganizeForm() {
  const [file, setFile] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<AnalyzeResponse["ingredients"] | null>(null);
  const [veganIngredients, setVeganIngredients] = useState<AnalyzeResponse["ingredients"] | null>(null);
  const [plan, setPlan] = useState<VeganizeResponse | null>(null);
  const [libraryEntries, setLibraryEntries] = useState<LibraryEntry[]>([]);
  const [intolerances, setIntolerances] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const fileLabel = useMemo(() => {
    if (!file) return "Bild hier ablegen oder auswählen";
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `${file.name} · ${sizeMB} MB`;
  }, [file]);

  const handleFileChange = (incoming: File | null) => {
    setFile(incoming);
    setError(null);
    setCameraError(null);
    setIngredients(null);
    setVeganIngredients(null);
    setPlan(null);
    setLibraryEntries([]);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Bitte ein Bild auswählen oder per Drag & Drop hinzufügen.");
      return;
    }

    setLoading(true);
    setError(null);
    setCameraError(null);
    setIngredients(null);
    setVeganIngredients(null);
    setPlan(null);
    setLibraryEntries([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!analyzeResponse.ok) {
        const message = await analyzeResponse.text();
        throw new Error(`Analyse fehlgeschlagen: ${message || analyzeResponse.statusText}`);
      }

      const analyzeData: AnalyzeResponse = await analyzeResponse.json();
      if (analyzeData.error) {
        throw new Error(analyzeData.error);
      }

      const veganizeResponse = await fetch("/api/veganize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: analyzeData.ingredients, intolerances }),
      });

      if (!veganizeResponse.ok) {
        const message = await veganizeResponse.text();
        throw new Error(`Veganisierung fehlgeschlagen: ${message || veganizeResponse.statusText}`);
      }

      const planData: VeganizeResponse = await veganizeResponse.json();
      if (planData.error) {
        throw new Error(planData.error);
      }

      const swapMap = new Map(
        planData.swaps.map((swap) => [swap.original.trim().toLowerCase(), swap]),
      );

      const veganizedIngredients = analyzeData.ingredients.map((ingredient) => {
        const key = ingredient.name.trim().toLowerCase();
        const swap = swapMap.get(key);
        if (swap) {
          return { ...ingredient, name: swap.veganAlternative };
        }
        return ingredient;
      });

      planData.swaps.forEach((swap) => {
        const normalizedAlternative = swap.veganAlternative.trim().toLowerCase();
        const exists = veganizedIngredients.some(
          (ingredient) => ingredient.name.trim().toLowerCase() === normalizedAlternative,
        );
        if (!exists) {
          veganizedIngredients.push({ name: swap.veganAlternative, amount: "nach Bedarf" });
        }
      });

      const collected: LibraryEntry[] = [];
      const seen = new Set<string>();
      planData.swaps.forEach((swap) => {
        const normalized = swap.veganAlternative.trim().toLowerCase();
        if (seen.has(normalized)) {
          return;
        }
        const libraryMatch = RECIPE_LIBRARY.find((item) =>
          item.keywords.some((keyword) => normalized.includes(keyword))
        );
        if (libraryMatch) {
          seen.add(normalized);
          collected.push(libraryMatch.entry);
        }
      });

      setIngredients(analyzeData.ingredients);
      setVeganIngredients(veganizedIngredients);
      setPlan(planData);
      setLibraryEntries(collected);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const launchCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraOpen(true);
    } catch (cameraErr) {
      const message =
        cameraErr instanceof Error ? cameraErr.message : "Zugriff auf die Kamera nicht möglich.";
      setCameraError(message);
      cameraInputRef.current?.click();
    }
  };

  return (
    <section className="rounded-3xl border border-accent bg-background/80 p-8 shadow-lg backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-dashed border-accent bg-white/60 p-6 text-center transition hover:border-highlight"
          onClick={() => filePickerRef.current?.click()}
        >
          <span className="text-sm font-medium tracking-wide text-primary/80">{fileLabel}</span>
          <input
            ref={filePickerRef}
            type="file"
            accept="image/*"
            onChange={(event) => handleFileChange(event.target.files?.[0] || null)}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => handleFileChange(event.target.files?.[0] || null)}
            className="hidden"
          />
          <p className="text-xs text-primary/60">
            Unterstützt werden JPG, PNG und HEIC bis 10&nbsp;MB.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                filePickerRef.current?.click();
              }}
              className="rounded-full bg-white/60 px-4 py-1 text-xs font-medium text-primary shadow-sm transition hover:bg-highlight hover:text-white"
            >
              Datei auswählen
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                void launchCamera();
              }}
              className="rounded-full bg-white/40 px-4 py-1 text-xs font-medium text-primary/80 shadow-sm transition hover:bg-highlight/90 hover:text-white"
            >
              Foto aufnehmen
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/70 p-6 shadow-inner">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-highlight">Unverträglichkeiten</h3>
          <p className="mt-2 text-xs text-primary/60">
            Wähle alle aus, die bei der veganen Variante berücksichtigt werden sollen.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Gluten", "Soja", "Nüsse", "Histamin"].map((option) => {
              const id = `veganize-${option.toLowerCase()}`;
              const checked = intolerances.includes(option);
              return (
                <label
                  key={option}
                  htmlFor={id}
                  className="flex items-center gap-3 rounded-xl border border-accent/60 bg-background/60 px-3 py-2 text-sm text-primary/80 transition hover:border-highlight"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      setIntolerances((prev) => {
                        if (event.target.checked) {
                          return [...prev, option];
                        }
                        return prev.filter((item) => item !== option);
                      });
                    }}
                    className="h-4 w-4 rounded border-accent text-highlight focus:ring-highlight"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-highlight px-6 py-3 font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:bg-accent"
          disabled={loading}
        >
          {loading ? "Bild wird analysiert…" : "Bild analysieren & veganisieren"}
        </button>
      </form>

      {error && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {cameraError && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {cameraError}
        </p>
      )}

      {loading && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4 text-sm text-primary/70">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-2 border-highlight/30" />
              <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-highlight border-r-highlight/60 animate-spin" />
              <div className="absolute inset-3 rounded-full border border-dashed border-primary/40 animate-[spin_3s_linear_infinite]" />
            </div>
            <div>
              <p className="font-semibold text-primary">Wir pflanzen gerade deine vegane Idee …</p>
              <p className="text-xs text-primary/60">
                Zutaten scannen, Alternativen bewerten und Vorschläge aus der Bibliothek zusammenstellen.
              </p>
            </div>
          </div>
        </div>
      )}

      {plan && (
        <div className="mt-8 space-y-6 border-t border-accent pt-8">
          {ingredients && (
            <div className="rounded-2xl bg-white/70 p-6 shadow-inner">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-highlight">
                Erkannte Original-Zutaten
              </h3>
              <ul className="grid grid-cols-1 gap-y-2 text-sm text-primary">
                {ingredients.map((ingredient) => (
                  <li
                    key={`original-${ingredient.name}-${ingredient.amount}`}
                    className="flex items-center justify-between rounded-lg bg-background/60 px-3 py-2"
                  >
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-primary/70">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {veganIngredients && (
            <div className="rounded-2xl bg-white/70 p-6 shadow-inner">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-highlight">
                Vegane Zutatenliste
              </h3>
              <ul className="grid grid-cols-1 gap-y-2 text-sm text-primary">
                {veganIngredients.map((ingredient) => (
                  <li
                    key={`vegan-${ingredient.name}-${ingredient.amount}`}
                    className="flex items-center justify-between rounded-lg bg-background/60 px-3 py-2"
                  >
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-primary/70">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-highlight">
                Veganisierungsvorschlag
              </h3>
              <VeganizePlanCard plan={plan} />
            </div>

            {libraryEntries.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-highlight">
                  Rezeptbibliothek
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {libraryEntries.map((entry) => (
                    <a
                      key={entry.href}
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative overflow-hidden rounded-2xl border border-accent bg-background/70 p-4 text-sm text-primary shadow-sm transition hover:shadow-md"
                    >
                      <div className="absolute -right-10 top-10 h-20 w-20 rounded-full bg-highlight/10 blur-3xl transition group-hover:bg-highlight/20" />
                      <div className="relative space-y-2">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-highlight">
                          Inspiration
                          <span aria-hidden>→</span>
                        </span>
                        <h4 className="text-base font-semibold text-primary">{entry.title}</h4>
                        <p className="text-primary/70">{entry.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-sm rounded-3xl border border-accent bg-background p-6 shadow-2xl">
            <video
              ref={videoRef}
              className="h-64 w-full rounded-2xl bg-black object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (videoRef.current && canvasRef.current) {
                    const video = videoRef.current;
                    const canvas = canvasRef.current;
                    const context = canvas.getContext("2d");
                    if (!context) {
                      setCameraError("Foto konnte nicht verarbeitet werden.");
                      stopCamera();
                      return;
                    }
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(
                      (blob) => {
                        if (!blob) {
                          setCameraError("Foto konnte nicht verarbeitet werden.");
                          stopCamera();
                          return;
                        }
                        const capturedFile = new File([blob], `camera-${Date.now()}.jpg`, {
                          type: blob.type || "image/jpeg",
                          lastModified: Date.now(),
                        });
                        handleFileChange(capturedFile);
                        stopCamera();
                      },
                      "image/jpeg",
                      0.92,
                    );
                  }
                }}
                className="flex-1 rounded-full bg-highlight px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary"
              >
                Foto verwenden
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="flex-1 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow hover:bg-accent"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
