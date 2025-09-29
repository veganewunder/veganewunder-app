import { NextResponse } from "next/server";
import { generateVeganRecipe } from "@/modules/recipe/services/generate";

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
    }

    const recipe = await generateVeganRecipe(ingredients);
    return NextResponse.json(recipe);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
// API-Endpunkt: Zutaten -> Rezept
