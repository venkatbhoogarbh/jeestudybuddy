import { NextResponse } from "next/server";
import { AIProviderError, generateResponse } from "@/lib/ai/provider";
import { REVISION_PLANNER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { parseGeneratedRevisionPlan, type RevisionTopic } from "@/lib/validators/schemas";

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
      topics?: RevisionTopic[];
    };

    const topics = Array.isArray(body.topics) ? body.topics : [];
    const selectedTopics = topics.filter((topic) => topic.status !== "revised");

    if (selectedTopics.length === 0) {
      return NextResponse.json({ error: "Please select at least one topic to revise." }, { status: 400 });
    }

    const topicSummary = selectedTopics
      .map((topic) => `${topic.subject}: ${topic.topic} [${topic.priority}] -> ${topic.action}`)
      .join("; ");

    const result = await generateResponse({
      systemPrompt: REVISION_PLANNER_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Create a short JEE revision plan from these topics: ${topicSummary}. Return valid JSON only.`,
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

    const plan = parseGeneratedRevisionPlan(planData);

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
