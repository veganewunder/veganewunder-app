import { NextResponse } from "next/server";
import { generateVeganizationPlan } from "@/modules/veganize/services/veganize";

export async function POST(req: Request) {
  try {
    const { ingredients, intolerances = [] } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
    }

    const plan = await generateVeganizationPlan(ingredients, intolerances);
    return NextResponse.json(plan);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
