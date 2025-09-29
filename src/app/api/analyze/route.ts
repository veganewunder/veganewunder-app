import { NextResponse } from "next/server";
import { extractIngredientsFromImage } from "@/modules/analyze/services/extract";

export async function GET() {
  return NextResponse.json({ message: "Analyze API is running 🚀" });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await extractIngredientsFromImage(file);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
