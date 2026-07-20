import { createClient } from "@/lib/supabase/server";

export async function getQuizAttempts(userId: string) {
  const supabase = await createClient();
  return supabase.from("quiz_attempts").select("*").eq("user_id", userId);
}
