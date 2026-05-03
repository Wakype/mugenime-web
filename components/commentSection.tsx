/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  MessageSquare,
  LogIn,
  Loader2,
  User as UserIcon,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Edit2,
  Trash2,
  SmilePlus,
  MessageCircleReply,
  ListFilter,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import CommentEditor from "./commentEditor";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { User } from "@supabase/supabase-js";
import { adminDeleteComment } from "@/app/admin/actions";

interface CommentSectionProps {
  identifier: string;
  page_url: string;
}

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  role?: string;
}

interface CommentVote {
  user_id: string;
  vote_type: 1 | -1;
}

interface CommentData {
  id: string;
  page_slug: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  profiles: Profile | null;
  comment_votes: CommentVote[] | null;
}

interface PageReaction {
  id: string;
  page_slug: string;
  user_id: string;
  reaction_type: string;
}

interface ExtendedUser extends User {
  role?: string;
  db_full_name?: string;
  db_avatar_url?: string;
}

type SortOption = "newest" | "oldest" | "popular";

const REACTION_TYPES = [
  { type: "upvote", emoji: "👍", label: "Upvote" },
  { type: "funny", emoji: "😂", label: "Funny" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "surprised", emoji: "😲", label: "Surprised" },
  { type: "angry", emoji: "😡", label: "Angry" },
  { type: "sad", emoji: "😢", label: "Sad" },
];

const DELETED_PLACEHOLDER = "[DELETED_COMMENT]";

const ExpandableContent = ({
  content,
  isDeleted,
}: {
  content: string;
  isDeleted: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      contentRef.current &&
      contentRef.current.scrollHeight > 250 &&
      !isDeleted
    ) {
      setNeedsTruncation(true);
    }
  }, [content, isDeleted]);

  if (isDeleted) {
    return (
      <p className="text-muted-foreground italic text-sm">
        Pesan telah dihapus.
      </p>
    );
  }

  return (
    <div className="relative">
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : needsTruncation ? 250 : "auto",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div
          ref={contentRef}
          className="prose dark:prose-invert prose-sm sm:prose-base max-w-none text-foreground prose-ul:list-disc prose-ol:list-decimal prose-ul:ml-4 prose-ol:ml-4 prose-p:my-1 prose-img:m-0"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.div>

      {!isExpanded && needsTruncation && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-card via-card/80 to-transparent flex items-end justify-start pb-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="rounded-full shadow-md text-xs h-7 cursor-pointer"
          >
            Baca Selengkapnya
          </Button>
        </div>
      )}

      {isExpanded && needsTruncation && (
        <div className="mt-2 flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="text-xs h-7 text-muted-foreground cursor-pointer hover:bg-secondary"
          >
            Tutup
          </Button>
        </div>
      )}
    </div>
  );
};

export default function CommentSection({
  identifier,
  page_url,
}: Readonly<CommentSectionProps>) {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [comments, setComments] = useState<CommentData[]>([]);
  const [pageReactions, setPageReactions] = useState<PageReaction[]>([]);

  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pendingComment, setPendingComment] = useState<{
    parentId: string | null;
    content: string;
  } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    let isMounted = true;

    const syncAuthData = async (sessionUser: User | null) => {
      if (!sessionUser) {
        if (isMounted) {
          setUser(null);
          setIsAuthLoading(false);
        }
        return;
      }
      try {
        // 2. Fetch full_name dan avatar_url
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, avatar_url")
          .eq("id", sessionUser.id)
          .single();

        if (isMounted) {
          setUser({
            ...sessionUser,
            role: profile?.role || "user",
            db_full_name:
              profile?.full_name || sessionUser.user_metadata?.full_name,
            db_avatar_url:
              profile?.avatar_url || sessionUser.user_metadata?.avatar_url,
          });
          setIsAuthLoading(false);
        }
      } catch {
        if (isMounted) {
          setUser({
            ...sessionUser,
            role: "user",
            db_full_name: sessionUser.user_metadata?.full_name,
            db_avatar_url: sessionUser.user_metadata?.avatar_url,
          });
          setIsAuthLoading(false);
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncAuthData(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncAuthData(session?.user || null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const fetchPageData = useCallback(
    async (showGlobalLoader = true) => {
      if (showGlobalLoader) setIsLoadingComments(true);

      try {
        const [commentsRes, reactionsRes] = await Promise.all([
          supabase
            .from("comments")
            .select(
              `*, profiles:user_id (full_name, avatar_url, role), comment_votes (user_id, vote_type)`,
            )
            .eq("page_slug", identifier)
            .order("created_at", { ascending: false }),
          supabase
            .from("page_reactions")
            .select("*")
            .eq("page_slug", identifier),
        ]);

        if (!commentsRes.error && commentsRes.data) {
          setComments(commentsRes.data as unknown as CommentData[]);
        }
        if (!reactionsRes.error && reactionsRes.data) {
          setPageReactions(reactionsRes.data as PageReaction[]);
        }
      } catch (err) {
        console.error("fetchPageData error:", err);
      } finally {
        if (showGlobalLoader) setIsLoadingComments(false);
      }
    },
    [identifier, supabase],
  );

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData, user?.id]);

  const handleLoginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${globalThis.location.origin}${globalThis.location.pathname}`,
      },
    });
  };

  const handleSubmitComment = async (
    htmlContent: string,
    parentId: string | null = null,
  ) => {
    if (!user) return;

    setIsSubmitting(true);
    setPendingComment({ parentId, content: htmlContent });

    const { error } = await supabase.from("comments").insert({
      page_slug: identifier,
      page_url: page_url,
      user_id: user.id,
      content: htmlContent,
      parent_id: parentId,
    });

    if (error) {
      toast.error("Gagal mengirim komentar.");
    } else {
      toast.success(parentId ? "Balasan terkirim!" : "Komentar terkirim!");
      setReplyingToId(null);
      await fetchPageData(false);
    }

    setPendingComment(null);
    setIsSubmitting(false);
  };

  const handleUpdateComment = async (commentId: string, newContent: string) => {
    setIsSubmitting(true);
    const { error } = await supabase
      .from("comments")
      .update({ content: newContent })
      .eq("id", commentId)
      .eq("user_id", user?.id);

    if (error) {
      toast.error("Gagal memperbarui komentar.");
    } else {
      toast.success("Komentar berhasil diperbarui!");
      setEditingId(null);
      await fetchPageData(false);
    }
    setIsSubmitting(false);
  };

  const executeDeleteComment = async () => {
    if (!commentToDelete || !user) return;

    const isSessionAdmin = user.role === "admin" || user.role === "superadmin";

    if (isSessionAdmin) {
      const res = await adminDeleteComment(commentToDelete);
      if (res.error) toast.error("Gagal menghapus komentar.");
      else toast.success("Komentar berhasil dihapus oleh Admin.");
    } else {
      const hasReplies = comments.some((c) => c.parent_id === commentToDelete);

      if (hasReplies) {
        const { error } = await supabase
          .from("comments")
          .update({ content: DELETED_PLACEHOLDER })
          .eq("id", commentToDelete)
          .eq("user_id", user.id);

        if (error) toast.error("Gagal menghapus komentar.");
        else toast.success("Komentar berhasil dihapus.");
      } else {
        const { error } = await supabase
          .from("comments")
          .delete()
          .eq("id", commentToDelete)
          .eq("user_id", user.id);

        if (error) toast.error("Gagal menghapus komentar.");
        else toast.success("Komentar berhasil dihapus.");
      }
    }

    await fetchPageData(false);
    setCommentToDelete(null);
  };

  const handleVote = async (commentId: string, voteType: 1 | -1) => {
    if (!user) return toast.error("Silakan login dulu untuk memberi reaksi!");

    const comment = comments.find((c) => c.id === commentId);
    const existingVote = comment?.comment_votes?.find(
      (v) => v.user_id === user.id,
    );

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        await supabase
          .from("comment_votes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("comment_votes")
          .update({ vote_type: voteType })
          .eq("comment_id", commentId)
          .eq("user_id", user.id);
      }
    } else {
      await supabase.from("comment_votes").insert({
        comment_id: commentId,
        user_id: user.id,
        vote_type: voteType,
      });
    }
    fetchPageData(false);
  };

  const handlePageReaction = async (reactionType: string) => {
    if (!user)
      return toast.error("Silakan login dulu untuk memberikan reaksi!");

    const existingReaction = pageReactions.find((r) => r.user_id === user.id);

    if (existingReaction) {
      if (existingReaction.reaction_type === reactionType) {
        await supabase
          .from("page_reactions")
          .delete()
          .eq("id", existingReaction.id);
      } else {
        await supabase
          .from("page_reactions")
          .update({ reaction_type: reactionType })
          .eq("id", existingReaction.id);
      }
    } else {
      await supabase.from("page_reactions").insert({
        page_slug: identifier,
        user_id: user.id,
        reaction_type: reactionType,
      });
    }
    fetchPageData(false);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const imageWrapper = target.closest(".uc-image-wrapper");
    if (imageWrapper) {
      const img = imageWrapper.querySelector("img");
      if (img) {
        const isExpanded = img.classList.contains("max-h-none");
        if (isExpanded) {
          img.classList.remove("max-h-none", "w-full");
          img.classList.add("max-h-[250px]", "w-auto");
          imageWrapper.classList.replace("cursor-zoom-out", "cursor-zoom-in");
        } else {
          img.classList.remove("max-h-[250px]", "w-auto");
          img.classList.add("max-h-none", "w-full");
          imageWrapper.classList.replace("cursor-zoom-in", "cursor-zoom-out");
        }
      }
    }
  };

  const renderAvatar = (isDeleted: boolean, profile: Profile | null) => {
    if (isDeleted) {
      return (
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50">
          <UserIcon className="w-5 h-5" />
        </div>
      );
    }

    if (profile?.avatar_url) {
      return (
        <Image
          src={profile.avatar_url}
          alt="Avatar"
          width={42}
          height={42}
          className="rounded-full ring-2 ring-muted min-h-[42px]"
        />
      );
    }

    return (
      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
        <UserIcon className="w-5 h-5" />
      </div>
    );
  };

  const renderMainInputArea = () => {
    if (isAuthLoading) {
      return (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      );
    }

    if (user) {
      return (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between bg-muted/30 p-2.5 rounded-xl border border-border/50">
            <div className="flex items-center gap-3">
              {user.db_avatar_url ? (
                <Image
                  src={user.db_avatar_url}
                  alt="Avatar"
                  width={36}
                  height={36}
                  className="rounded-full ring-2 ring-background object-cover min-h-9"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground ring-2 ring-background">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-foreground line-clamp-1">
                  {user.db_full_name || "You"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Mau komentar apa hari ini?
                </p>
              </div>
            </div>
          </div>
          <CommentEditor
            onSubmit={(content) => handleSubmitComment(content, null)}
            isLoading={isSubmitting}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 bg-muted/20 rounded-xl border border-dashed border-border animate-in fade-in">
        <div className="p-4 bg-primary/5 rounded-full text-primary mb-2">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-foreground">
            Ikut Bergabung dalam Diskusi
          </h4>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Silakan masuk dengan akun Google kamu untuk meninggalkan komentar,
            memberi reaksi, dan membalas.
          </p>
        </div>
        <Button
          onClick={handleLoginGoogle}
          className="rounded-full font-bold shadow-lg shadow-primary/20 px-8 cursor-pointer"
        >
          <LogIn className="w-4 h-4 mr-2" /> Login dengan Google
        </Button>
      </div>
    );
  };

  const renderMainCommentArea = () => {
    if (isLoadingComments) {
      return (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (comments.length > 0 || pendingComment) {
      return (
        <div className="space-y-6" onClick={handleContentClick}>
          {renderCommentList(null, 0)}
        </div>
      );
    }

    return (
      <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl bg-muted/10">
        <MessageSquare className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground font-medium">Belum ada komentar.</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Jadilah yang pertama memulai diskusi!
        </p>
      </div>
    );
  };

  const getSortedRootComments = (rootComments: CommentData[]) => {
    return [...rootComments].sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      if (sortBy === "popular") {
        const scoreA =
          (a.comment_votes?.filter((v) => v.vote_type === 1).length || 0) -
          (a.comment_votes?.filter((v) => v.vote_type === -1).length || 0);
        const scoreB =
          (b.comment_votes?.filter((v) => v.vote_type === 1).length || 0) -
          (b.comment_votes?.filter((v) => v.vote_type === -1).length || 0);
        return scoreB - scoreA;
      }
      return 0;
    });
  };

  const renderCommentList = (parentId: string | null = null, depth = 0) => {
    let currentLevelComments = comments.filter((c) => c.parent_id === parentId);

    if (parentId === null) {
      currentLevelComments = getSortedRootComments(currentLevelComments);
    } else {
      currentLevelComments = [...currentLevelComments].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    }

    return (
      <>
        {/* Render Pending/Optimistic Comment */}
        {pendingComment?.parentId === parentId && (
          <div
            className={cn(
              "flex flex-col gap-3",
              depth > 0 && "ml-5 md:ml-12 border-l-2 border-border/50 pl-4",
            )}
          >
            <div className="flex gap-4 p-4 md:p-5 bg-card border border-border rounded-xl shadow-sm opacity-60 animate-pulse">
              <div className="shrink-0">
                {user?.db_avatar_url ? (
                  <Image
                    src={user.db_avatar_url}
                    alt="Avatar"
                    width={42}
                    height={42}
                    className="rounded-full ring-2 ring-muted min-h-[42px]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    {user?.db_full_name || "You"}
                  </span>
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Mengirim...
                  </span>
                </div>
                <div
                  className="prose dark:prose-invert prose-sm sm:prose-base max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: pendingComment.content }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Mapping Komentar */}
        {currentLevelComments.map((comment) => {
          const likes =
            comment.comment_votes?.filter((v) => v.vote_type === 1).length || 0;
          const dislikes =
            comment.comment_votes?.filter((v) => v.vote_type === -1).length ||
            0;
          const userVote = user
            ? comment.comment_votes?.find((v) => v.user_id === user.id)
                ?.vote_type
            : null;

          const isDeleted = comment.content === DELETED_PLACEHOLDER;
          const isOwner = user?.id === comment.user_id;

          const isSessionAdmin =
            user?.role === "admin" || user?.role === "superadmin";
          const canDelete = isOwner || isSessionAdmin;

          const isCommentAuthorAdmin =
            comment.profiles?.role === "admin" ||
            comment.profiles?.role === "superadmin";

          return (
            <div
              key={comment.id}
              className={cn(
                "flex flex-col gap-3",
                depth > 0 && "ml-5 md:ml-12 border-l-2 border-border/50 pl-4",
              )}
            >
              <div
                className={cn(
                  "flex gap-4 p-4 md:p-5 bg-card border border-border rounded-xl shadow-sm transition-all hover:shadow-md",
                  isDeleted && "opacity-70 bg-muted/20 border-dashed",
                )}
              >
                <div className="shrink-0">
                  {renderAvatar(isDeleted, comment.profiles)}
                </div>

                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-foreground">
                        {isDeleted
                          ? "Pengguna dihapus"
                          : comment.profiles?.full_name || "User"}
                      </span>

                      {isCommentAuthorAdmin && !isDeleted && (
                        <span className="bg-blue-500/10 text-blue-500 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          Admin
                        </span>
                      )}

                      {isOwner && !isDeleted && (
                        <span className="bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          You
                        </span>
                      )}

                      <span className="flex items-center text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(comment.created_at)} WIB
                      </span>
                    </div>

                    {canDelete && !isDeleted && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isOwner && (
                            <DropdownMenuItem
                              onClick={() => setEditingId(comment.id)}
                              className="cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <DropdownMenuItem
                              onClick={() => setCommentToDelete(comment.id)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" /> Hapus
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {editingId === comment.id && !isDeleted ? (
                    <div className="pt-2">
                      <CommentEditor
                        initialContent={comment.content}
                        onSubmit={(content) =>
                          handleUpdateComment(comment.id, content)
                        }
                        onCancel={() => setEditingId(null)}
                        submitLabel="Simpan"
                        isLoading={isSubmitting}
                      />
                    </div>
                  ) : (
                    <ExpandableContent
                      content={comment.content}
                      isDeleted={isDeleted}
                    />
                  )}

                  {!editingId && !isDeleted && (
                    <div className="flex items-center gap-3 pt-1 border-t border-border/50 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(comment.id, 1)}
                        className={cn(
                          "h-7 px-2 gap-1.5 mt-2 rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer",
                          userVote === 1 && "bg-primary/10 text-primary",
                        )}
                      >
                        <ThumbsUp
                          className={cn(
                            "w-3.5 h-3.5",
                            userVote === 1 && "fill-primary",
                          )}
                        />
                        <span className="text-xs font-semibold">{likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(comment.id, -1)}
                        className={cn(
                          "h-7 px-2 gap-1.5 mt-2 rounded-full hover:bg-destructive/10 hover:text-destructive cursor-pointer",
                          userVote === -1 &&
                            "bg-destructive/10 text-destructive",
                        )}
                      >
                        <ThumbsDown
                          className={cn(
                            "w-3.5 h-3.5",
                            userVote === -1 && "fill-destructive",
                          )}
                        />
                        <span className="text-xs font-semibold">
                          {dislikes}
                        </span>
                      </Button>

                      <div className="w-px h-3.5 bg-border mt-2 mx-1" />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setReplyingToId(
                            replyingToId === comment.id ? null : comment.id,
                          )
                        }
                        className="h-7 px-2.5 gap-1.5 mt-2 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <MessageCircleReply className="w-4 h-4" />
                        <span className="text-xs font-semibold">Balas</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {replyingToId === comment.id && (
                <div className="mt-1 ml-4 md:ml-10">
                  {/* GENERATE INITIAL CONTENT UNTUK REPLY */}
                  {(() => {
                    const replyName = isDeleted
                      ? "Pengguna"
                      : comment.profiles?.full_name || "User";

                    const replyContent = `<p><span data-mention="true" data-label="@${replyName}"></span>&nbsp;</p>`;

                    return (
                      <CommentEditor
                        initialContent={replyContent}
                        onSubmit={(content) =>
                          handleSubmitComment(content, comment.id)
                        }
                        onCancel={() => setReplyingToId(null)}
                        submitLabel="Kirim Balasan"
                        isLoading={isSubmitting}
                        autoFocus={true}
                      />
                    );
                  })()}
                </div>
              )}

              {renderCommentList(comment.id, depth + 1)}
            </div>
          );
        })}
      </>
    );
  };

  const userActiveReaction = user
    ? pageReactions.find((r) => r.user_id === user.id)?.reaction_type
    : null;

  return (
    <section className="relative w-full max-w-full mx-auto mt-5 border-t border-border pt-8">
      <AlertDialog
        open={!!commentToDelete}
        onOpenChange={(open) => !open && setCommentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Komentar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan. Jika komentar ini memiliki
              balasan, isi pesannya akan disembunyikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDeleteComment}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative overflow-hidden bg-primary/5 border border-primary/20 rounded-2xl p-5 md:p-6 mb-8 shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity duration-500 group-hover:opacity-100 opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-5">
          <div className="shrink-0">
            <div className="p-2.5 bg-background text-primary rounded-xl ring-1 ring-primary/20 shadow-sm flex items-center justify-center w-fit">
              <Info className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3 flex-1">
            <h4 className="font-bold text-foreground text-base tracking-tight">
              Aturan Berkomentar
            </h4>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                <span className="leading-relaxed">
                  Gunakan bahasa yang sopan dan saling menghargai.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                <span className="leading-relaxed">
                  Dilarang menyebarkan link ilegal, spam, pornografi, atau
                  promosi.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                <span className="leading-relaxed">
                  Hargai pendapat orang lain, hindari perdebatan toxic (SARA).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                <span className="leading-relaxed">
                  Komentar yang melanggar akan dihapus tanpa pemberitahuan.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            Komentar
          </h3>
          <span className="bg-secondary text-muted-foreground text-xs font-bold px-2.5 py-1 rounded-full">
            {comments.length} Komentar
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-card border border-border p-2 rounded-2xl shadow-sm">
          <div className="hidden sm:flex items-center text-xs font-medium text-muted-foreground mr-2 pl-2">
            <SmilePlus className="w-4 h-4 mr-1.5" /> Reaksi:
          </div>
          {REACTION_TYPES.map(({ type, emoji, label }) => {
            const count = pageReactions.filter(
              (r) => r.reaction_type === type,
            ).length;
            const isActive = userActiveReaction === type;

            return (
              <button
                key={type}
                onClick={() => handlePageReaction(type)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all cursor-pointer",
                  isActive
                    ? "bg-primary/15 border border-primary/30 shadow-sm text-primary"
                    : "bg-muted/40 hover:bg-muted border border-transparent text-muted-foreground",
                )}
              >
                <span>{emoji}</span>
                <span
                  className={cn(
                    "font-medium text-xs",
                    isActive ? "text-primary" : "text-foreground",
                  )}
                >
                  {label}
                </span>
                {count > 0 && (
                  <span
                    className={cn(
                      "font-bold text-xs ml-1 bg-background/50 px-1.5 py-0.5 rounded-md",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-10 bg-card border border-border p-4 rounded-2xl shadow-sm">
        {renderMainInputArea()}
      </div>

      <div className="space-y-6">
        {comments.length > 0 && (
          <div className="flex justify-end items-center mb-4">
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val as SortOption)}
            >
              <SelectTrigger className="w-40 h-9 bg-card cursor-pointer">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Urutkan" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest" className="cursor-pointer">
                  Terbaru
                </SelectItem>
                <SelectItem value="oldest" className="cursor-pointer">
                  Terlama
                </SelectItem>
                <SelectItem value="popular" className="cursor-pointer">
                  Populer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {renderMainCommentArea()}
      </div>
    </section>
  );
}
