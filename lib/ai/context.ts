import { TEACHER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import type { TeacherChatMessage } from "@/lib/ai/provider";

export function buildTeacherMessages(question: string, history: Array<{ role: "user" | "assistant"; content: string }>) {
  const messages: TeacherChatMessage[] = [
    {
      role: "system",
      content: TEACHER_SYSTEM_PROMPT,
    },
    ...history.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    })),
    {
      role: "user",
      content: question,
    },
  ];

  return messages;
}
