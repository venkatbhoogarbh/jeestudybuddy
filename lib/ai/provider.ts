export type TeacherChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatImageInput = {
  dataUrl: string;
  mimeType: string;
};

type TeacherResponse = {
  text: string;
};

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent`;

type GenerateResponseOptions = {
  systemPrompt: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  image?: ChatImageInput | null;
};

export class AIProviderError extends Error {
  status: number;
  type: string | null;
  code: string | null;
  requestId: string | null;

  constructor(message: string, options: { status: number; type: string | null; code: string | null; requestId: string | null }) {
    super(message);
    this.name = "AIProviderError";
    this.status = options.status;
    this.type = options.type;
    this.code = options.code;
    this.requestId = options.requestId;
  }
}

export async function generateResponse({
  systemPrompt,
  messages,
  image = null,
}: GenerateResponseOptions): Promise<TeacherResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const requestId = crypto.randomUUID();
  const requestBody = {
    contents: messages.map((message, index) => {
      const isLastUserMessage = index === messages.length - 1 && message.role === "user";

      return {
        role: message.role === "assistant" ? "model" : "user",
        parts: [
          { text: message.content },
          ...(isLastUserMessage && image
            ? [
                {
                  inlineData: {
                    mimeType: image.mimeType,
                    data: image.dataUrl.split(",")[1] ?? "",
                  },
                },
              ]
            : []),
        ],
      };
    }),
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: 0.4,
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Request-Id": requestId,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const requestIdHeader = response.headers.get("x-request-id");
    let parsedError: { error?: { type?: string; code?: string; message?: string } } | null = null;

    try {
      parsedError = (await response.json()) as { error?: { type?: string; code?: string; message?: string } };
    } catch {
      parsedError = null;
    }

    const errorType = parsedError?.error?.type ?? null;
    const errorCode = parsedError?.error?.code ?? null;
    const errorMessage = parsedError?.error?.message ?? `Gemini request failed with status ${response.status}.`;
    const safeRequestId = requestIdHeader ?? requestId;

    console.error("Gemini API error", {
      status: response.status,
      type: errorType,
      code: errorCode,
      requestId: safeRequestId,
      url: GEMINI_API_URL,
      model: DEFAULT_MODEL,
    });

    throw new AIProviderError(errorMessage, {
      status: response.status,
      type: errorType,
      code: errorCode,
      requestId: safeRequestId,
    });
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const text =
    data.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text ?? "")
      .join("\n")
      .trim() ||
    "";

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return { text };
}

export async function generateTeacherResponse(
  systemPrompt: string,
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>,
): Promise<TeacherResponse> {
  return generateResponse({
    systemPrompt,
    messages,
  });
}
