import { createClient } from "@/utils/supabase/client";

export interface CommentProfile {
  full_name: string | null;
  avatar_url: string | null;
  role?: string;
}

export interface CommentVote {
  user_id: string;
  vote_type: 1 | -1;
}

export interface CommentData {
  id: string;
  page_slug: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  profiles: CommentProfile | null;
  comment_votes: CommentVote[] | null;
}

export interface PageReaction {
  id: string;
  page_slug: string;
  user_id: string;
  reaction_type: string;
}

const getClient = () => createClient();

/**
 * Fetch all comments and page reactions for a specific identifier.
 */
export async function getCommentsAndReactions(identifier: string): Promise<{
  comments: CommentData[];
  reactions: PageReaction[];
  error?: string;
}> {
  const supabase = getClient();
  try {
    const [commentsRes, reactionsRes] = await Promise.all([
      supabase
        .from("comments")
        .select(
          `*, profiles:user_id (full_name, avatar_url, role), comment_votes (user_id, vote_type)`
        )
        .eq("page_slug", identifier)
        .order("created_at", { ascending: false }),
      supabase
        .from("page_reactions")
        .select("*")
        .eq("page_slug", identifier),
    ]);

    const comments = commentsRes.error ? [] : (commentsRes.data as unknown as CommentData[]);
    const reactions = reactionsRes.error ? [] : (reactionsRes.data as PageReaction[]);

    let errorMsg: string | undefined;
    if (commentsRes.error) {
      console.error("Error fetching comments:", commentsRes.error);
      errorMsg = commentsRes.error.message;
    }
    if (reactionsRes.error) {
      console.error("Error fetching reactions:", reactionsRes.error);
    }

    return { comments, reactions, error: errorMsg };
  } catch (err: any) {
    console.error("Unexpected error in getCommentsAndReactions:", err);
    return { comments: [], reactions: [], error: err.message || "Failed to load data" };
  }
}

/**
 * Insert a new comment or reply.
 */
export async function postComment({
  identifier,
  pageUrl,
  userId,
  content,
  parentId = null,
}: {
  identifier: string;
  pageUrl: string;
  userId: string;
  content: string;
  parentId?: string | null;
}) {
  const supabase = getClient();
  return await supabase.from("comments").insert({
    page_slug: identifier,
    page_url: pageUrl,
    user_id: userId,
    content: content,
    parent_id: parentId,
  });
}

/**
 * Update an existing comment content.
 */
export async function updateCommentContent({
  commentId,
  userId,
  newContent,
}: {
  commentId: string;
  userId: string;
  newContent: string;
}) {
  const supabase = getClient();
  return await supabase
    .from("comments")
    .update({ content: newContent })
    .eq("id", commentId)
    .eq("user_id", userId);
}

/**
 * Delete a comment by regular user (soft-delete placeholder if replies exist).
 */
export async function deleteCommentByUser({
  commentId,
  userId,
  hasReplies,
  deletedPlaceholder,
}: {
  commentId: string;
  userId: string;
  hasReplies: boolean;
  deletedPlaceholder: string;
}) {
  const supabase = getClient();
  if (hasReplies) {
    return await supabase
      .from("comments")
      .update({ content: deletedPlaceholder })
      .eq("id", commentId)
      .eq("user_id", userId);
  }
  return await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId);
}

/**
 * Vote or remove vote on a comment.
 */
export async function toggleCommentVote({
  commentId,
  userId,
  voteType,
  existingVote,
}: {
  commentId: string;
  userId: string;
  voteType: 1 | -1;
  existingVote: CommentVote | undefined;
}) {
  const supabase = getClient();
  if (existingVote) {
    if (existingVote.vote_type === voteType) {
      return await supabase
        .from("comment_votes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", userId);
    } else {
      return await supabase
        .from("comment_votes")
        .update({ vote_type: voteType })
        .eq("comment_id", commentId)
        .eq("user_id", userId);
    }
  }
  return await supabase.from("comment_votes").insert({
    comment_id: commentId,
    user_id: userId,
    vote_type: voteType,
  });
}

/**
 * Add, update, or remove page reaction.
 */
export async function togglePageReaction({
  identifier,
  userId,
  reactionType,
  existingReaction,
}: {
  identifier: string;
  userId: string;
  reactionType: string;
  existingReaction: PageReaction | undefined;
}) {
  const supabase = getClient();
  if (existingReaction) {
    if (existingReaction.reaction_type === reactionType) {
      return await supabase
        .from("page_reactions")
        .delete()
        .eq("id", existingReaction.id);
    } else {
      return await supabase
        .from("page_reactions")
        .update({ reaction_type: reactionType })
        .eq("id", existingReaction.id);
    }
  }
  return await supabase.from("page_reactions").insert({
    page_slug: identifier,
    user_id: userId,
    reaction_type: reactionType,
  });
}
