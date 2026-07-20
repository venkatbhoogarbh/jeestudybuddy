"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { upsertUserProfile } from "@/lib/db/users";

export async function signUpAction(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/auth/sign-up?error=Email%20and%20password%20are%20required.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || undefined,
      },
    },
  });

  if (error) {
    redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    await upsertUserProfile(
      data.user.id,
      data.user.email ?? email,
      data.user.user_metadata?.full_name ?? fullName ?? null,
    );
  }

  if (!data.session) {
    redirect("/auth/sign-in?message=Account%20created.%20Please%20sign%20in.");
  }

  redirect("/dashboard");
}
