import openai from "@/modules/shared/services/openai";

type Ingredient = {
  name: string;
  amount: string;
};

type Recipe = {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  steps: string[];
};

export async function generateVeganRecipe(ingredients: Ingredient[], intolerances: string[] = []): Promise<Recipe> {
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Du bist ein kreativer veganer Kochassistent. Antworte immer ausschließlich im JSON-Format und verwende durchgehend die deutsche Sprache (Titel, Beschreibung, Zutaten, Schritte).",
      },
      {
        role: "user",
        content: `Erstelle ein veganes Rezept aus diesen Zutaten: ${JSON.stringify(
          ingredients
        )}. Vermeide konsequent alle folgenden Unverträglichkeiten: ${
          intolerances.length > 0 ? intolerances.join(", ") : "Keine"
        }. Verwende ausschließlich deutsche Zutatenbezeichnungen und schreibe die Anleitung auf Deutsch. Gib das Ergebnis im Format { "title": string, "description"?: string, "ingredients": Ingredient[], "steps": string[] } zurück.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const message = response.choices[0]?.message?.content;
  if (!message) {
    throw new Error("Leere Antwort vom Rezeptmodell erhalten.");
  }

  return JSON.parse(message) as Recipe;
}
