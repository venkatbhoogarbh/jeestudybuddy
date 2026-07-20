import { NextResponse } from "next/server";
import { generateResponse, AIProviderError } from "@/lib/ai/provider";
import { STUDY_PLANNER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { parseGeneratedStudyPlan } from "@/lib/validators/schemas";

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
      examDate?: string;
      dailyStudyHours?: number;
      subjects?: string[];
      topics?: string;
    };

    const examDate = String(body.examDate ?? "").trim();
    const dailyStudyHours = Number(body.dailyStudyHours);
    const subjects = Array.isArray(body.subjects) ? body.subjects.filter(Boolean).map(String) : [];
    const topics = String(body.topics ?? "").trim();

    if (!examDate) {
      return NextResponse.json({ error: "Please enter an exam date." }, { status: 400 });
    }

    if (!Number.isFinite(dailyStudyHours) || dailyStudyHours <= 0) {
      return NextResponse.json({ error: "Please enter valid daily study hours." }, { status: 400 });
    }

    if (subjects.length === 0) {
      return NextResponse.json({ error: "Please select at least one subject." }, { status: 400 });
    }

    if (!topics) {
      return NextResponse.json({ error: "Please enter at least one topic." }, { status: 400 });
    }

    const result = await generateResponse({
      systemPrompt: STUDY_PLANNER_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Create a personalized JEE study plan. Exam date: ${examDate}. Available study hours per day: ${dailyStudyHours}. Subjects: ${subjects.join(", ")}. Topics: ${topics}. Return valid JSON only.`,
        },
      ],
    });

    const parsedText = extractJson(result.text);

    let planData: unknown;
    try {
      planData = JSON.parse(parsedText);
    } catch {
      return NextResponse.json({ error: "The AI returned invalid JSON. Please try again." }, { status: 502 });
    }

    const plan = parseGeneratedStudyPlan(planData);

    return NextResponse.json({ plan });
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
