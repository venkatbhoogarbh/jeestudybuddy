import { createClient } from "@/lib/supabase/server";

export async function upsertUserProfile(userId: string, email: string, fullName?: string | null) {
  const supabase = await createClient();
  return supabase.from("profiles").upsert({
    id: userId,
    email,
    full_name: fullName ?? null,
    updated_at: new Date().toISOString(),
  });
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  return supabase.from("profiles").select("*").eq("id", userId).single();
}
