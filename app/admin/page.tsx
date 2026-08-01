import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ShieldAlert,
  Users,
  MessageSquare,
  FileText,
  CalendarClock,
  Clock,
  ExternalLink,
  MessageCircle,
  BarChart3,
  Inbox,
  UserX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AdminRoleButton } from "@/components/adminRoleButton";
import { AdminDeleteButton } from "@/components/adminActionButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAdminComments,
  computeAdminCommentStats,
} from "@/services/admin-comment-service";

export const revalidate = 0;

// --- Helper: Relative time in Indonesian ---
function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} hari lalu`;
  if (hours > 0) return `${hours} jam lalu`;
  if (minutes > 0) return `${minutes} menit lalu`;
  return "Baru saja";
}

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    !currentUserProfile ||
    !["admin", "superadmin"].includes(currentUserProfile.role)
  ) {
    redirect("/");
  }

  const isSuperAdmin = currentUserProfile.role === "superadmin";

  const { data: users, count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("role", { ascending: true });

  // Use comment-service for all comment data
  const comments = await getAdminComments(cookieStore);
  const stats = computeAdminCommentStats(comments);
  const maxPageCount =
    stats.pageDistribution.length > 0 ? stats.pageDistribution[0].count : 1;

  return (
    <div className="min-h-screen bg-background pb-20 py-10">
      <div className="container mx-auto px-4 space-y-8">
        {/* HEADER — preserved as-is */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin Panel
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-foreground">
              Dashboard <span className="text-primary">Sistem</span>
            </h1>
            <p className="text-muted-foreground">
              Pantau pengguna dan moderasi komentar dari semua halaman.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* STATS GRID — 4 glassmorphism cards                    */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Pengguna */}
          <div className="relative group p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_24px_-6px_rgba(59,130,246,0.15)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Pengguna
                </span>
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">
                {totalUsers || 0}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Terdaftar di sistem
              </p>
            </div>
          </div>

          {/* Total Komentar */}
          <div className="relative group p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_24px_-6px_rgba(16,185,129,0.15)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Komentar
                </span>
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">
                {stats.totalComments}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Dari semua halaman
              </p>
            </div>
          </div>

          {/* Halaman Aktif */}
          <div className="relative group p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_24px_-6px_rgba(245,158,11,0.15)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Halaman
                </span>
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">
                {stats.activePages}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Dengan komentar aktif
              </p>
            </div>
          </div>

          {/* Komentar Hari Ini */}
          <div className="relative group p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_24px_-6px_rgba(139,92,246,0.15)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl transition-all duration-500 group-hover:bg-violet-500/20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500 ring-1 ring-violet-500/20">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Hari Ini
                </span>
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">
                {stats.commentsToday}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Komentar baru masuk
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* MAIN CONTENT: Tabs (left) + Sidebar (right)           */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — Tabbed Content */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="w-full grid grid-cols-2 h-11 bg-secondary/50 backdrop-blur-sm rounded-xl p-1">
                <TabsTrigger
                  value="users"
                  className="rounded-lg text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-md cursor-pointer transition-all"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Daftar Pengguna
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="rounded-lg text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-md cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Moderasi Komentar
                </TabsTrigger>
              </TabsList>

              {/* ──── TAB: USERS ──── */}
              <TabsContent value="users">
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  {/* Table Header */}
                  <div className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_auto] items-center gap-4 px-5 py-3.5 bg-secondary/30 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Pengguna</span>
                    <span className="hidden md:block">Komentar</span>
                    <span className="hidden md:block">Bergabung</span>
                    <span className="text-right">Aksi</span>
                  </div>

                  {/* User Rows */}
                  <div className="max-h-[620px] overflow-y-auto custom-scrollbar divide-y divide-border/50">
                    {users?.map((u) => (
                      <div
                        key={u.id}
                        className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/20 group"
                      >
                        {/* User Info */}
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shrink-0 relative border-2 border-border group-hover:border-primary/30 transition-colors">
                            {u.avatar_url ? (
                              <Image
                                src={u.avatar_url}
                                alt="avatar"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                <span className="text-sm font-bold text-primary/70">
                                  {(u.full_name || "?").charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-sm font-bold truncate text-foreground">
                              {u.full_name || "Tanpa Nama"}
                            </span>
                            <Badge
                              variant="outline"
                              className={`w-fit mt-0.5 text-[10px] px-1.5 py-0 font-semibold ${
                                u.role === "superadmin"
                                  ? "border-primary text-primary bg-primary/5"
                                  : u.role === "admin"
                                    ? "border-blue-500 text-blue-500 bg-blue-500/5"
                                    : "border-border text-muted-foreground"
                              }`}
                            >
                              {u.role === "superadmin"
                                ? "⚡ SUPERADMIN"
                                : u.role === "admin"
                                  ? "🛡️ ADMIN"
                                  : "USER"}
                            </Badge>
                          </div>
                        </div>

                        {/* Comment Count */}
                        <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="font-medium">
                            {stats.commentsByUser[u.id] || 0}
                          </span>
                        </div>

                        {/* Join Date */}
                        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "-"}
                          </span>
                        </div>

                        {/* Action */}
                        <div className="flex justify-end min-w-[120px]">
                          {isSuperAdmin && u.role !== "superadmin" ? (
                            <AdminRoleButton userId={u.id} currentRole={u.role} />
                          ) : (
                            <div className="h-8 min-w-[120px] flex items-center justify-center">
                              <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider font-medium">Pemilik</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {(!users || users.length === 0) && (
                      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <UserX className="w-12 h-12 mb-3 opacity-30" />
                        <p className="font-semibold">Belum ada pengguna</p>
                        <p className="text-xs mt-1 opacity-70">
                          Pengguna akan muncul setelah registrasi.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* ──── TAB: COMMENTS ──── */}
              <TabsContent value="comments">
                <div className="space-y-5">
                  {Object.keys(stats.groupedComments).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-2xl text-muted-foreground bg-card/50">
                      <Inbox className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-lg font-bold">Belum ada komentar</p>
                      <p className="text-sm mt-1 opacity-70">
                        Komentar dari semua halaman akan tampil di sini.
                      </p>
                    </div>
                  ) : (
                    Object.entries(stats.groupedComments).map(
                      ([slug, slugComments]) => (
                        <div
                          key={slug}
                          className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-border/80"
                        >
                          {/* Page Header */}
                          <div className="flex items-center justify-between px-5 py-3.5 bg-secondary/20 border-b border-border/50">
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                <FileText className="w-4 h-4 text-emerald-500" />
                              </div>
                              <Badge
                                variant="secondary"
                                className="font-mono text-xs bg-secondary/80"
                              >
                                /{slug}
                              </Badge>
                              {slugComments[0]?.page_url && (
                                <a
                                  href={slugComments[0].page_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition font-medium"
                                >
                                  Kunjungi
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                              <MessageCircle className="w-3.5 h-3.5" />
                              {slugComments.length}
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="divide-y divide-border/30 max-h-[420px] overflow-y-auto custom-scrollbar">
                            {slugComments.map((c) => (
                              <div
                                key={c.id}
                                className="px-5 py-3.5 transition-colors hover:bg-secondary/10 relative group"
                              >
                                <div className="flex items-start gap-3">
                                  {/* Avatar */}
                                  <div className="w-9 h-9 rounded-full bg-secondary overflow-hidden shrink-0 relative border border-border">
                                    {c.profiles?.avatar_url ? (
                                      <Image
                                        src={c.profiles.avatar_url}
                                        alt="avatar"
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                                        <span className="text-xs font-bold text-emerald-500/70">
                                          {(c.profiles?.full_name || "?")
                                            .charAt(0)
                                            .toUpperCase()}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-sm font-bold text-foreground">
                                        {c.profiles?.full_name || "Anonim"}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {timeAgo(c.created_at)}
                                      </span>
                                      {c.parent_id && (
                                        <Badge
                                          variant="outline"
                                          className="text-[9px] px-1.5 py-0 text-amber-500 border-amber-500/30 bg-amber-500/5"
                                        >
                                          Balasan
                                        </Badge>
                                      )}
                                    </div>
                                    <div
                                      className="text-sm text-foreground/80 leading-relaxed prose dark:prose-invert prose-sm max-w-none line-clamp-3"
                                      dangerouslySetInnerHTML={{
                                        __html: c.content,
                                      }}
                                    />
                                  </div>

                                  {/* Delete Button */}
                                  <AdminDeleteButton commentId={c.id} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* ──── RIGHT SIDEBAR ──── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Activity Timeline */}
            <div className="relative bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.03] to-transparent pointer-events-none" />
              <div className="relative px-5 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 ring-1 ring-violet-500/20">
                      <Clock className="w-4 h-4 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Aktivitas Terbaru</h3>
                      <p className="text-[10px] text-muted-foreground/60">Komentar terbaru masuk</p>
                    </div>
                  </div>
                  {stats.recentActivity.length > 0 && (
                    <Badge variant="secondary" className="text-[10px] font-medium tabular-nums">
                      {stats.recentActivity.length} terbaru
                    </Badge>
                  )}
                </div>
              </div>

              <div className="relative p-4">
                {stats.recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <div className="p-3 rounded-full bg-secondary/50 mb-3">
                      <Inbox className="w-6 h-6 opacity-30" />
                    </div>
                    <p className="text-sm font-medium">Belum ada aktivitas</p>
                    <p className="text-[10px] opacity-60 mt-0.5">Komentar baru akan muncul di sini.</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {stats.recentActivity.map((c, i) => (
                      <div key={c.id} className="flex gap-3 group">
                        {/* Timeline dot + line */}
                        <div className="flex flex-col items-center pt-0.5">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden shrink-0 relative border-2 border-border group-hover:border-violet-500/30 transition-all">
                              {c.profiles?.avatar_url ? (
                                <Image
                                  src={c.profiles.avatar_url}
                                  alt="avatar"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-violet-600/5">
                                  <span className="text-[10px] font-bold text-violet-500/70">
                                    {(c.profiles?.full_name || "?").charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            {i === 0 && (
                              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                            )}
                          </div>
                          {i < stats.recentActivity.length - 1 && (
                            <div className="w-px flex-1 bg-gradient-to-b from-border to-transparent my-1.5 min-h-[12px]" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="pb-4 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-xs font-bold text-foreground truncate">
                              {c.profiles?.full_name || "Anonim"}
                            </span>
                            <span className="text-[10px] text-muted-foreground/50 shrink-0">
                              {timeAgo(c.created_at)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed mb-1.5">
                            {c.content.replace(/<[^>]*>/g, "").slice(0, 80)}
                            {c.content.replace(/<[^>]*>/g, "").length > 80 ? "…" : ""}
                          </p>
                          <div className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground/50 bg-secondary/50 px-1.5 py-0.5 rounded">
                            <FileText className="w-2.5 h-2.5" />
                            /{c.page_slug}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Page Distribution Chart */}
            <div className="relative bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.03] to-transparent pointer-events-none" />
              <div className="relative px-5 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/20">
                      <BarChart3 className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Distribusi Komentar</h3>
                      <p className="text-[10px] text-muted-foreground/60">Top halaman berdasarkan komentar</p>
                    </div>
                  </div>
                  {stats.pageDistribution.length > 0 && (
                    <Badge variant="secondary" className="text-[10px] font-medium tabular-nums">
                      Top {stats.pageDistribution.length}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="relative p-4 space-y-1">
                {stats.pageDistribution.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <div className="p-3 rounded-full bg-secondary/50 mb-3">
                      <BarChart3 className="w-6 h-6 opacity-30" />
                    </div>
                    <p className="text-sm font-medium">Belum ada data</p>
                    <p className="text-[10px] opacity-60 mt-0.5">Statistik muncul setelah ada komentar.</p>
                  </div>
                ) : (
                  stats.pageDistribution.map((page, i) => {
                    const percentage = Math.round(
                      (page.count / maxPageCount) * 100,
                    );
                    const colorSets = [
                      { bar: "bg-gradient-to-r from-primary to-primary/70", text: "text-primary", bg: "bg-primary/10" },
                      { bar: "bg-gradient-to-r from-emerald-500 to-emerald-400", text: "text-emerald-500", bg: "bg-emerald-500/10" },
                      { bar: "bg-gradient-to-r from-amber-500 to-amber-400", text: "text-amber-500", bg: "bg-amber-500/10" },
                      { bar: "bg-gradient-to-r from-blue-500 to-blue-400", text: "text-blue-500", bg: "bg-blue-500/10" },
                      { bar: "bg-gradient-to-r from-violet-500 to-violet-400", text: "text-violet-500", bg: "bg-violet-500/10" },
                    ];
                    const color = colorSets[i % colorSets.length];
                    const rankEmojis = ["🥇", "🥈", "🥉"];
                    return (
                      <div key={page.slug} className="group p-2.5 rounded-xl transition-colors hover:bg-secondary/20">
                        <div className="flex items-center gap-3">
                          {/* Rank */}
                          <div className="shrink-0 w-7 text-center">
                            {i < 3 ? (
                              <span className="text-base">{rankEmojis[i]}</span>
                            ) : (
                              <span className={`text-xs font-bold ${color.text}`}>#{i + 1}</span>
                            )}
                          </div>

                          {/* Bar + Info */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs text-foreground/80 truncate">
                                /{page.slug}
                              </span>
                              <div className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${color.bg} ${color.text}`}>
                                {page.count} komentar
                              </div>
                            </div>
                            <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${color.bar} transition-all duration-700 ease-out`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
