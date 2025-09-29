import openai from "@/modules/shared/services/openai";

type Ingredient = {
  name: string;
  amount: string;
};

type VeganizePlan = {
  dish: string;
  overview: string;
  swaps: Array<{
    original: string;
    veganAlternative: string;
    notes?: string;
  }>;
  steps: string[];
};

const VEGAN_KEYWORDS = [
  "tofu",
  "tempeh",
  "seitan",
  "gemüse",
  "obst",
  "pilz",
  "lins",
  "lentil",
  "bohne",
  "kichererb",
  "erbs",
  "nuss",
  "samen",
  "hafer",
  "reis",
  "quinoa",
  "soja",
  "kokos",
  "planz",
  "milchersatz",
  "pflanzenmilch",
  "vegan",
  "salat",
  "kohl",
  "kartoff",
  "kraut",
  "tomat",
  "paprika",
  "zucchini",
  "auberg",
];

function isLikelyVeganIngredient(name: string) {
  const lower = name.toLowerCase();
  return VEGAN_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export async function generateVeganizationPlan(
  ingredients: Ingredient[],
  intolerances: string[] = []
): Promise<VeganizePlan> {
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Du bist ein kulinarischer Assistent, der Gerichte veganisiert. Antworte ausschließlich im JSON-Format und verwende für alle Namen, Beschreibungen und Zutaten konsequent die deutsche Sprache.",
      },
      {
        role: "user",
        content: `Analysiere die Zutaten dieses Gerichts: ${JSON.stringify(
          ingredients
        )}. Ersetze ausschließlich nicht-vegane Zutaten (z. B. Fleisch, Fisch, Milchprodukte, Eier, Honig). Wenn eine Zutat bereits vegan ist (etwa Tofu, Gemüse, Hülsenfrüchte, Getreide, Obst, Nüsse, Samen, Kräuter), belasse sie unverändert und führe sie nicht in den Swaps auf. Stelle sicher, dass alle Zutaten und Alternativen deutsch benannt werden. Vermeide strikt folgende Unverträglichkeiten: ${
          intolerances.length > 0 ? intolerances.join(", ") : "keine"
        }. Liefere das Ergebnis im Format { "dish": string, "overview": string, "swaps": { "original": string, "veganAlternative": string, "notes"?: string }[], "steps": string[] } und schreibe alle Texte auf Deutsch.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const message = response.choices[0]?.message?.content;
  if (!message) {
    throw new Error("Leere Antwort vom Veganize-Modell erhalten.");
  }

  const parsed = JSON.parse(message) as VeganizePlan;

  parsed.swaps = parsed.swaps.filter((swap) => {
    const original = swap.original ?? "";
    return original.trim().length > 0 && !isLikelyVeganIngredient(original);
  });

  return parsed;
}
