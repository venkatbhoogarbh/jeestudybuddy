import { NextResponse } from "next/server";
import { generateResponse, AIProviderError } from "@/lib/ai/provider";
import { QUIZ_GENERATOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { isQuizDifficulty, isQuizQuestionCount, isQuizSubject, parseGeneratedQuiz } from "@/lib/validators/schemas";

function extractJson(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  }

  return trimmed;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      subject?: string;
      topic?: string;
      difficulty?: string;
      questionCount?: number;
    };

    const subject = String(body.subject ?? "").trim();
    const topic = String(body.topic ?? "").trim();
    const difficulty = String(body.difficulty ?? "").trim();
    const questionCount = Number(body.questionCount);

    if (!isQuizSubject(subject)) {
      return NextResponse.json({ error: "Please choose a valid subject." }, { status: 400 });
    }

    if (!topic) {
      return NextResponse.json({ error: "Please enter a topic." }, { status: 400 });
    }

    if (!isQuizDifficulty(difficulty)) {
      return NextResponse.json({ error: "Please choose a valid difficulty." }, { status: 400 });
    }

    if (!isQuizQuestionCount(questionCount)) {
      return NextResponse.json({ error: "Quiz length must be 5 or 10 questions." }, { status: 400 });
    }

    const result = await generateResponse({
      systemPrompt: QUIZ_GENERATOR_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a ${questionCount}-question MCQ quiz for ${subject} on the topic "${topic}" with ${difficulty} difficulty. Return valid JSON only.`,
        },
      ],
    });

    const parsedText = extractJson(result.text);

    let quizData: unknown;
    try {
      quizData = JSON.parse(parsedText);
    } catch {
      return NextResponse.json(
        {
          error: "The AI returned invalid JSON. Please try again.",
        },
        { status: 502 },
      );
    }

    const quiz = parseGeneratedQuiz(quizData);

    if (quiz.questions.length !== questionCount) {
      return NextResponse.json(
        {
          error: `The AI returned ${quiz.questions.length} questions instead of ${questionCount}. Please try again.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ quiz });
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
