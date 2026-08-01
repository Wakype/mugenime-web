import { createClient } from "@/utils/supabase/server";
import type { cookies } from "next/headers";

export interface AdminComment {
  id: string;
  page_slug: string;
  page_url: string | null;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
}

/**
 * Fetch all comments with profiles for the admin dashboard.
 * Must be called from a Server Component.
 */
export async function getAdminComments(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Promise<AdminComment[]> {
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin comments:", error);
    return [];
  }

  return (data as unknown as AdminComment[]) || [];
}

export interface AdminCommentStats {
  totalComments: number;
  commentsToday: number;
  activePages: number;
  groupedComments: Record<string, AdminComment[]>;
  pageDistribution: { slug: string; count: number }[];
  recentActivity: AdminComment[];
  commentsByUser: Record<string, number>;
}

/**
 * Compute aggregated statistics from admin comments.
 */
export function computeAdminCommentStats(
  comments: AdminComment[],
): AdminCommentStats {
  const totalComments = comments.length;

  // Comments posted today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const commentsToday = comments.filter(
    (c) => new Date(c.created_at) >= todayStart,
  ).length;

  // Group by page_slug
  const groupedComments: Record<string, AdminComment[]> = {};
  const commentsByUser: Record<string, number> = {};

  comments.forEach((comment) => {
    // Group by page
    if (!groupedComments[comment.page_slug]) {
      groupedComments[comment.page_slug] = [];
    }
    groupedComments[comment.page_slug].push(comment);

    // Count by user
    commentsByUser[comment.user_id] =
      (commentsByUser[comment.user_id] || 0) + 1;
  });

  const activePages = Object.keys(groupedComments).length;

  // Top 5 pages by comment count
  const pageDistribution = Object.entries(groupedComments)
    .map(([slug, items]) => ({ slug, count: items.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 5 most recent comments for activity timeline
  const recentActivity = comments.slice(0, 5);

  return {
    totalComments,
    commentsToday,
    activePages,
    groupedComments,
    pageDistribution,
    recentActivity,
    commentsByUser,
  };
}
