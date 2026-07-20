import { NextResponse } from "next/server";
import { buildTeacherMessages } from "@/lib/ai/context";
import { AIProviderError, generateResponse } from "@/lib/ai/provider";
import { TEACHER_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      question?: string;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
    };

    const question = String(body.question ?? "").trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const messages = buildTeacherMessages(question, history);
    const result = await generateResponse({
      systemPrompt: TEACHER_SYSTEM_PROMPT,
      messages: messages
        .filter((message) => message.role !== "system")
        .map((message) => ({
          role: message.role as "user" | "assistant",
          content: message.content,
        })),
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
