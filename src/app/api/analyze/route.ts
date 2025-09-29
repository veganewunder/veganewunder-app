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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
