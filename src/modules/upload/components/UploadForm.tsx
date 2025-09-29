"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import RecipeCard from "@/modules/recipe/components/RecipeCard";

interface AnalyzeResponse {
  ingredients: { name: string; amount: string }[];
  error?: string;
}

interface RecipeResponse {
  title: string;
  description?: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  error?: string;
}

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<AnalyzeResponse["ingredients"] | null>(null);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [intolerances, setIntolerances] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

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
    setRecipe(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Bitte ein Bild auswählen oder per Drag & Drop hinzufügen.");
      return;
    }

    setLoading(true);
    setError(null);
    setIngredients(null);
    setRecipe(null);

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

      setIngredients(analyzeData.ingredients);

      const recipeResponse = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: analyzeData.ingredients, intolerances }),
      });

      if (!recipeResponse.ok) {
        const message = await recipeResponse.text();
        throw new Error(`Rezept-Generierung fehlgeschlagen: ${message || recipeResponse.statusText}`);
      }

      const recipeData: RecipeResponse = await recipeResponse.json();
      if (recipeData.error) {
        throw new Error(recipeData.error);
      }

      setRecipe(recipeData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(message);
    } finally {
      setLoading(false);
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
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              filePickerRef.current?.click();
            }}
            className="mx-auto rounded-full bg-white/60 px-4 py-1 text-xs font-medium text-primary shadow-sm transition hover:bg-highlight hover:text-white"
          >
            Datei auswählen
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (!navigator.mediaDevices?.getUserMedia) {
                cameraInputRef.current?.click();
                return;
              }
              const startCamera = async () => {
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
                    cameraErr instanceof Error
                      ? cameraErr.message
                      : "Zugriff auf die Kamera nicht möglich.";
                  setCameraError(message);
                  cameraInputRef.current?.click();
                }
              };
              void startCamera();
            }}
            className="mx-auto rounded-full bg-white/40 px-4 py-1 text-xs font-medium text-primary/80 shadow-sm transition hover:bg-highlight/90 hover:text-white"
          >
            Foto aufnehmen
          </button>
        </div>

        <div className="rounded-2xl bg-white/70 p-6 shadow-inner">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-highlight">Unverträglichkeiten</h3>
          <p className="mt-2 text-xs text-primary/60">
            Wähle alle aus, die berücksichtigt werden sollen. Das Rezept vermeidet diese Zutaten.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Gluten", "Soja", "Nüsse", "Histamin"].map((option) => {
              const id = `intolerance-${option.toLowerCase()}`;
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
          {loading ? "Analyse & Rezept werden erstellt…" : "Bild analysieren & Rezept erstellen"}
        </button>
      </form>

      {error && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && !error && (
        <p className="mt-6 text-sm text-highlight">Bitte warten – dein veganes Rezept wird vorbereitet.</p>
      )}

      {(ingredients || recipe) && (
        <div className="mt-8 space-y-6 border-t border-accent pt-8">
          {ingredients && (
            <div className="rounded-2xl bg-white/70 p-6 shadow-inner">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-highlight">Erkannte Zutaten</h3>
              <ul className="grid grid-cols-1 gap-y-2 text-sm text-primary">
                {ingredients.map((ingredient) => (
                  <li
                    key={`${ingredient.name}-${ingredient.amount}`}
                    className="flex items-center justify-between rounded-lg bg-background/60 px-3 py-2"
                  >
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-primary/70">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-highlight">Vorgeschlagenes Rezept</h3>
              <RecipeCard recipe={recipe} />
            </div>
          )}
        </div>
      )}

      {cameraError && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {cameraError}
        </p>
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
