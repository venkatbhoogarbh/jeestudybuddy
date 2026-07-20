"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { upsertUserProfile } from "@/lib/db/users";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    redirect("/auth/sign-in?error=Email%20and%20password%20are%20required.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect(`/auth/sign-in?error=${encodeURIComponent(error?.message ?? "Unable to sign in.")}`);
  }

  await upsertUserProfile(
    data.user.id,
    data.user.email ?? email,
    data.user.user_metadata?.full_name ?? null,
  );

  redirect(nextPath.startsWith("/") ? nextPath : "/dashboard");
}
