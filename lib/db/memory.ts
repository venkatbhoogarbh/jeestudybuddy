import { createClient } from "@/lib/supabase/server";

export async function getPersonalizationContext(userId: string) {
  const supabase = await createClient();
  return supabase.from("ai_memory_context").select("*").eq("user_id", userId).maybeSingle();
}
