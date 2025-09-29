import openai from "@/modules/shared/services/openai";

export async function extractIngredientsFromImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64Image = buffer.toString("base64");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Du bist ein Assistent, der Zutaten aus Essensfotos erkennt. Antworte ausschließlich im JSON-Format und benutze für alle Zutaten deutsche Bezeichnungen (z. B. 'Tomate', 'Zwiebel', 'Hafermilch').",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Erkenne die Zutaten auf diesem Foto und gib sie als JSON zurück im Format { ingredients: [{ name: string, amount: string }] }. Verwende deutsche Namen und schreibe Mengenangaben auf Deutsch (z. B. '1 Bund', '200 g').",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  const message = response.choices[0].message?.content;
  return JSON.parse(message || "{}");
}
