import { NextResponse } from "next/server";
import { AIProviderError, generateResponse } from "@/lib/ai/provider";
import { DOUBT_SOLVER_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const question = String(formData.get("question") ?? "").trim();
    const imageFile = formData.get("image");

    if (!question && !(imageFile instanceof File)) {
      return NextResponse.json({ error: "Please enter a doubt or upload an image." }, { status: 400 });
    }

    let image: { dataUrl: string; mimeType: string } | null = null;

    if (imageFile instanceof File && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      image = {
        dataUrl: `data:${imageFile.type || "image/png"};base64,${buffer.toString("base64")}`,
        mimeType: imageFile.type || "image/png",
      };
    }

    const messages = [
      {
        role: "user" as const,
        content: question || "Please solve the doubt from the uploaded image.",
      },
    ];

    const result = await generateResponse({
      systemPrompt: DOUBT_SOLVER_SYSTEM_PROMPT,
      messages,
      image,
    });

    return NextResponse.json({ answer: result.text });
  } catch (error) {
    if (error instanceof AIProviderError) {
      return NextResponse.json(
        {
          error: error.message,
          requestId: error.requestId,
          type: error.type,
          code: error.code,
        },
        { status: error.status || 500 },
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
