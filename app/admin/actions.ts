"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// Helper untuk membuat admin client secara lazy dengan fallback environment variables
function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not set");
  }

  return createAdminClient(supabaseUrl, serviceKey || "");
}

export async function adminDeleteComment(commentId: string) {
  const supabaseAdmin = getAdminClient();

  // Cek apakah komentar ini punya balasan (child comments)
  const { data: replies } = await supabaseAdmin
    .from("comments")
    .select("id")
    .eq("parent_id", commentId)
    .limit(1);

  const hasReplies = replies && replies.length > 0;

  let error;
  if (hasReplies) {
    // Soft delete (Ubah teks saja agar balasan dibawahnya tidak error/hilang)
    const res = await supabaseAdmin
      .from("comments")
      .update({ content: "[DELETED_COMMENT]" })
      .eq("id", commentId);
    error = res.error;
  } else {
    // Hard delete
    const res = await supabaseAdmin
      .from("comments")
      .delete()
      .eq("id", commentId);
    error = res.error;
  }

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

export async function updateUserRole(targetUserId: string, newRole: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "superadmin") {
    return { error: "Hanya Superadmin yang dapat mengubah role." };
  }

  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetUserId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}
