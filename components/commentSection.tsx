/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  ShieldCheck,
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
import { useAuth } from "@/context/auth-context";
import {
  getCommentsAndReactions,
  postComment,
  updateCommentContent,
  deleteCommentByUser,
  toggleCommentVote,
  togglePageReaction,
  CommentData,
  PageReaction,
  CommentProfile as Profile,
} from "@/services/comment-service";
import CommentEditor from "./commentEditor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { adminDeleteComment } from "@/app/admin/actions";

interface CommentSectionProps {
  identifier: string;
  page_url: string;
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
      contentRef.current.scrollHeight > 500 &&
      !isDeleted
    ) {
      setNeedsTruncation(true);
    }
  }, [content, isDeleted]);

  if (isDeleted) {
    return (
      <p className="text-muted-foreground italic text-xs py-1">
        Pesan telah dihapus.
      </p>
    );
  }

  return (
    <div className="relative">
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : needsTruncation ? 500 : "auto",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div
          ref={contentRef}
          className="prose dark:prose-invert prose-sm max-w-none text-foreground/95 leading-relaxed prose-ul:list-disc prose-ol:list-decimal prose-ul:ml-4 prose-ol:ml-4 prose-p:my-1.5 prose-img:m-0 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.div>

      {!isExpanded && needsTruncation && (
        <div className="absolute bottom-0 -left-12 -right-3.5 sm:-left-16 sm:-right-4 h-28 bg-gradient-to-t from-card via-card/90 to-transparent flex items-end justify-center pb-2.5 pointer-events-none">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="pointer-events-auto rounded-full text-xs font-bold h-7 px-5 shadow-md bg-card/95 backdrop-blur-md border border-border/80 hover:border-primary/40 hover:scale-105 transition-all cursor-pointer"
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
            className="text-xs h-7 text-muted-foreground hover:text-foreground cursor-pointer transition-colors rounded-full"
          >
            Sembunyikan
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
  const { user, isAuthLoading, loginWithGoogle } = useAuth();

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

  const handleLoginGoogle = async () => {
    await loginWithGoogle();
  };

  const fetchPageData = useCallback(
    async (showGlobalLoader = true) => {
      if (showGlobalLoader) setIsLoadingComments(true);
      const res = await getCommentsAndReactions(identifier);
      setComments(res.comments);
      setPageReactions(res.reactions);
      if (showGlobalLoader) setIsLoadingComments(false);
    },
    [identifier],
  );

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handleSubmitComment = async (
    htmlContent: string,
    parentId: string | null = null,
  ) => {
    if (!user) return;

    setIsSubmitting(true);
    setPendingComment({ parentId, content: htmlContent });

    const { error } = await postComment({
      identifier,
      pageUrl: page_url,
      userId: user.id,
      content: htmlContent,
      parentId,
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
    if (!user) return;
    setIsSubmitting(true);

    const { error } = await updateCommentContent({
      commentId,
      userId: user.id,
      newContent,
    });

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
      const { error } = await deleteCommentByUser({
        commentId: commentToDelete,
        userId: user.id,
        hasReplies,
        deletedPlaceholder: DELETED_PLACEHOLDER,
      });

      if (error) toast.error("Gagal menghapus komentar.");
      else toast.success("Komentar berhasil dihapus.");
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

    const { error } = await toggleCommentVote({
      commentId,
      userId: user.id,
      voteType,
      existingVote,
    });

    if (error) {
      toast.error("Gagal memperbarui reaksi komentar.");
    } else {
      fetchPageData(false);
    }
  };

  const handlePageReaction = async (reactionType: string) => {
    if (!user)
      return toast.error("Silakan login dulu untuk memberikan reaksi!");

    const existingReaction = pageReactions.find((r) => r.user_id === user.id);

    const { error } = await togglePageReaction({
      identifier,
      userId: user.id,
      reactionType,
      existingReaction,
    });

    if (!error) {
      fetchPageData(false);
    }
  };

  const formatDate = (dateString: string) => {
    const formatted = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(dateString));
    return `${formatted.replace(".", ":")} WIB`;
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
        <div className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-full bg-muted flex items-center justify-center text-muted-foreground/60 shrink-0 aspect-square">
          <UserIcon className="w-4 h-4" />
        </div>
      );
    }

    if (profile?.avatar_url) {
      return (
        <div className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-full overflow-hidden shrink-0 aspect-square ring-1 ring-border/60 shadow-2xs">
          <Image
            src={profile.avatar_url}
            alt="Avatar"
            width={36}
            height={36}
            className="w-full h-full object-cover rounded-full aspect-square"
          />
        </div>
      );
    }

    return (
      <div className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 aspect-square">
        <UserIcon className="w-4 h-4" />
      </div>
    );
  };

  const renderMainInputArea = () => {
    if (isAuthLoading) {
      return (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      );
    }

    if (user) {
      return (
        <div className="p-4 sm:p-5 rounded-2xl bg-card/70 backdrop-blur-md border border-border/80 shadow-xs space-y-4 hover:border-primary/30 transition-all duration-300">
          <div className="flex items-center gap-3 px-1 pb-1">
            {user.db_avatar_url ? (
              <div className="w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full overflow-hidden shrink-0 aspect-square ring-1 ring-primary/30">
                <Image
                  src={user.db_avatar_url}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover rounded-full aspect-square"
                />
              </div>
            ) : (
              <div className="w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 aspect-square">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                {user.db_full_name || "Kamu"}
              </span>
              {(user.role === "admin" || user.role === "superadmin") && (
                <span className="text-[10px] font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
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
      <div className="p-8 rounded-2xl border border-dashed border-border/80 text-center space-y-4 bg-muted/10">
        <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h4 className="font-bold text-sm text-foreground">
            Ikut Bergabung dalam Diskusi
          </h4>
          <p className="text-xs text-muted-foreground">
            Login dengan Google untuk berkomentar dan memberikan reaksi.
          </p>
        </div>
        <Button
          onClick={handleLoginGoogle}
          size="sm"
          className="rounded-full font-bold text-xs px-7 py-4 cursor-pointer bg-gradient-to-r from-primary via-primary/90 to-primary/80 shadow-md shadow-primary/20"
        >
          <LogIn className="w-4 h-4 mr-2" /> Login dengan Google
        </Button>
      </div>
    );
  };

  const renderMainCommentArea = () => {
    if (isLoadingComments) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Memuat komentar...</p>
        </div>
      );
    }

    if (comments.length > 0 || pendingComment) {
      return (
        <div className="space-y-3" onClick={handleContentClick}>
          {renderCommentList(null, 0)}
        </div>
      );
    }

    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-muted-foreground border border-dashed border-border/60 rounded-2xl bg-card/20">
        <MessageSquare className="w-8 h-8 stroke-1 opacity-50" />
        <p className="text-sm font-medium">Belum ada komentar</p>
        <p className="text-xs opacity-70">
          Jadilah yang pertama untuk memulai diskusi!
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

    if (
      currentLevelComments.length === 0 &&
      pendingComment?.parentId !== parentId
    ) {
      return null;
    }

    return (
      <AnimatePresence mode="popLayout">
        <div className={cn("space-y-3", depth > 0 && "ml-4 sm:ml-8 mt-3")}>
          {/* Pending/Optimistic Comment Card */}
          {pendingComment?.parentId === parentId && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-card border border-primary/40 shadow-xs opacity-75 flex items-start gap-3"
            >
              <div className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-full overflow-hidden shrink-0 aspect-square ring-1 ring-border/60">
                {user?.db_avatar_url ? (
                  <Image
                    src={user.db_avatar_url}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover rounded-full aspect-square"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-foreground">
                    {user?.db_full_name || "Kamu"}
                  </span>
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  <span className="text-[11px] text-primary font-medium">
                    Mengirim...
                  </span>
                </div>
                <div
                  className="prose dark:prose-invert prose-sm max-w-none text-foreground/80"
                  dangerouslySetInnerHTML={{ __html: pendingComment.content }}
                />
              </div>
            </motion.div>
          )}

          {/* Minimal Modern Comment Cards */}
          {currentLevelComments.map((comment) => {
            const likes =
              comment.comment_votes?.filter((v) => v.vote_type === 1).length ||
              0;
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
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div
                  className={cn(
                    "p-3.5 sm:p-4 rounded-2xl bg-card/60 hover:bg-card/90 border border-border/70 hover:border-border transition-all duration-200 shadow-2xs group flex items-start gap-3.5",
                    isDeleted && "opacity-60 bg-muted/20 border-dashed",
                  )}
                >
                  {renderAvatar(isDeleted, comment.profiles)}

                  <div className="flex-1 space-y-1.5 min-w-0">
                    {/* Header Info */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-bold text-foreground tracking-tight">
                          {isDeleted
                            ? "Pengguna dihapus"
                            : comment.profiles?.full_name || "Pengguna"}
                        </span>

                        {isCommentAuthorAdmin && !isDeleted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </span>
                        )}

                        {isOwner && !isDeleted && (
                          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Kamu
                          </span>
                        )}

                        <span className="text-muted-foreground/40">•</span>

                        <span className="flex items-center text-[11px] text-muted-foreground font-medium">
                          <Clock className="w-3 h-3 mr-1 text-muted-foreground/70" />
                          {formatDate(comment.created_at)}
                        </span>
                      </div>

                      {canDelete && !isDeleted && (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground cursor-pointer transition-opacity"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-lg text-xs"
                          >
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

                    {/* Content */}
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

                    {/* Minimalist Action Bar */}
                    {!editingId && !isDeleted && (
                      <div className="flex items-center gap-3 pt-1.5 text-xs">
                        <div className="inline-flex items-center bg-muted/40 p-0.5 rounded-full border border-border/40">
                          <button
                            onClick={() => handleVote(comment.id, 1)}
                            className={cn(
                              "px-2 py-0.5 rounded-full flex items-center gap-1 hover:text-primary transition-colors cursor-pointer text-muted-foreground",
                              userVote === 1 &&
                                "bg-primary text-primary-foreground hover:text-primary-foreground font-bold shadow-2xs",
                            )}
                          >
                            <ThumbsUp
                              className={cn(
                                "w-3.5 h-3.5",
                                userVote === 1 && "fill-current",
                              )}
                            />
                            <span className="text-[11px]">
                              {likes > 0 ? likes : "Suka"}
                            </span>
                          </button>

                          <div className="w-px h-3 bg-border/50 mx-0.5" />

                          <button
                            onClick={() => handleVote(comment.id, -1)}
                            className={cn(
                              "px-2 py-0.5 rounded-full flex items-center gap-1 hover:text-destructive transition-colors cursor-pointer text-muted-foreground",
                              userVote === -1 &&
                                "bg-destructive text-destructive-foreground hover:text-destructive-foreground font-bold shadow-2xs",
                            )}
                          >
                            <ThumbsDown
                              className={cn(
                                "w-3.5 h-3.5",
                                userVote === -1 && "fill-current",
                              )}
                            />
                            {dislikes > 0 && (
                              <span className="text-[11px]">{dislikes}</span>
                            )}
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            setReplyingToId(
                              replyingToId === comment.id ? null : comment.id,
                            )
                          }
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer font-medium text-xs",
                            replyingToId === comment.id &&
                              "bg-primary/10 text-primary font-bold",
                          )}
                        >
                          <MessageCircleReply className="w-3.5 h-3.5" />
                          <span>Balas</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Reply Form */}
                {replyingToId === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 ml-4 sm:ml-8 p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs"
                  >
                    {(() => {
                      const replyName = isDeleted
                        ? "Pengguna"
                        : comment.profiles?.full_name || "Pengguna";

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
                  </motion.div>
                )}

                {/* Render Child Replies recursively */}
                {renderCommentList(comment.id, depth + 1)}
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    );
  };

  const userActiveReaction = user
    ? pageReactions.find((r) => r.user_id === user.id)?.reaction_type
    : null;

  return (
    <section className="relative w-full max-w-full mx-auto mt-6 border-t border-border/60 pt-6 space-y-6">
      <AlertDialog
        open={!!commentToDelete}
        onOpenChange={(open) => !open && setCommentToDelete(null)}
      >
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">
              Hapus Komentar?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Tindakan ini tidak bisa dibatalkan. Jika komentar ini memiliki
              balasan, isi pesannya akan disembunyikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-full cursor-pointer text-xs h-8">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDeleteComment}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full text-xs h-8 cursor-pointer"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rules Banner (Unchanged as requested) */}
      <div className="relative overflow-hidden bg-primary/5 border border-primary/20 rounded-2xl p-5 md:p-6 mb-8 shadow-xs">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity duration-500 group-hover:opacity-100 opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-5">
          <div className="shrink-0">
            <div className="p-2.5 bg-background text-primary rounded-xl ring-1 ring-primary/20 shadow-xs flex items-center justify-center w-fit">
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

      {/* Modern Section Header & Reactions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                Komentar
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {comments.length}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-fit bg-card/60 backdrop-blur-md p-3 rounded-2xl border border-border/80 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold text-muted-foreground">
            <SmilePlus className="w-4 h-4 text-primary" />
            <span>Reaction:</span>
          </div>

          <div className="grid grid-cols-3 xl:grid-cols-6 gap-2 w-full sm:w-auto">
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
                    "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border shadow-2xs active:scale-95 text-center",
                    isActive
                      ? "bg-gradient-to-r from-primary via-primary/95 to-primary/85 text-primary-foreground border-primary/40 shadow-md shadow-primary/25 scale-102"
                      : "bg-card/90 hover:bg-card border-border/80 hover:border-primary/40 text-foreground/80 hover:text-foreground",
                  )}
                >
                  <span className="text-base sm:text-sm leading-none">
                    {emoji}
                  </span>
                  <span className="text-[11px] leading-tight font-semibold tracking-tight">
                    {label}
                  </span>
                  <span
                    className={cn(
                      "font-extrabold text-[10px] px-1.5 py-0.2 rounded-full min-w-[16px] text-center",
                      isActive
                        ? "bg-primary-foreground/25 text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Input Area */}
      <div>{renderMainInputArea()}</div>

      {/* Sorting & Comment List */}
      <div className="space-y-3">
        {comments.length > 0 && (
          <div className="flex justify-between items-center px-1 text-xs text-muted-foreground">
            <span>{comments.length} Komentar</span>
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val as SortOption)}
            >
              <SelectTrigger className="w-32 h-8 text-xs border-0 bg-transparent shadow-none hover:bg-muted/40 rounded-lg cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <ListFilter className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Urutkan" />
                </div>
              </SelectTrigger>
              <SelectContent align="end" className="text-xs rounded-lg">
                <SelectItem value="newest" className="cursor-pointer text-xs">
                  Terbaru
                </SelectItem>
                <SelectItem value="oldest" className="cursor-pointer text-xs">
                  Terlama
                </SelectItem>
                <SelectItem value="popular" className="cursor-pointer text-xs">
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
