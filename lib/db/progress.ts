import { createClient } from "@/lib/supabase/server";

export async function getStudyProgress(userId: string) {
  const supabase = await createClient();
  return supabase.from("study_progress").select("*").eq("user_id", userId);
}
