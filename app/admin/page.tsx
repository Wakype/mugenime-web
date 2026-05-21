import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldAlert, Users, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { updateUserRole } from "./actions";
import { AdminDeleteButton } from "@/components/adminActionButton";

export const revalidate = 0;

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

  const { data: comments } = await supabase
    .from("comments")
    .select("*, profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false });

  const totalComments = comments?.length || 0;

  const groupedComments: Record<string, any[]> = {};
  if (comments) {
    comments.forEach((comment) => {
      if (!groupedComments[comment.page_slug]) {
        groupedComments[comment.page_slug] = [];
      }
      groupedComments[comment.page_slug].push(comment);
    });
  }

  return (
    <div className="min-h-screen bg-background pb-20 py-10">
      <div className="container mx-auto px-4 space-y-10">
        {/* HEADER */}
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

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border">
            <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Total Pengguna
              </p>
              <h3 className="text-3xl font-black text-foreground">
                {totalUsers || 0}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border">
            <div className="p-4 rounded-xl bg-green-500/10 text-green-500">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Total Komentar
              </p>
              <h3 className="text-3xl font-black text-foreground">
                {totalComments}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MANAJEMEN USER */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              <h2 className="text-xl font-bold text-foreground">
                Daftar Pengguna
              </h2>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-4 space-y-3">
                {users?.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shrink-0 relative border border-border">
                        {u.avatar_url ? (
                          <Image
                            src={u.avatar_url}
                            alt="avatar"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 m-auto mt-2.5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-sm font-bold truncate">
                          {u.full_name || "Tanpa Nama"}
                        </span>
                        <Badge
                          variant="outline"
                          className={`w-fit mt-1 text-[10px] px-1.5 py-0 ${u.role === "superadmin" ? "border-primary text-primary" : u.role === "admin" ? "border-blue-500 text-blue-500" : ""}`}
                        >
                          {u.role.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {isSuperAdmin && u.role !== "superadmin" && (
                      <form
                        action={async () => {
                          "use server";
                          await updateUserRole(
                            u.id,
                            u.role === "admin" ? "user" : "admin",
                          );
                        }}
                      >
                        <Button
                          variant={
                            u.role === "admin" ? "destructive" : "default"
                          }
                          size="sm"
                          className="h-8 text-xs cursor-pointer"
                        >
                          {u.role === "admin" ? "Cabut Admin" : "Jadikan Admin"}
                        </Button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MANAJEMEN KOMENTAR */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <span className="w-1 h-6 bg-green-500 rounded-full"></span>
              <h2 className="text-xl font-bold text-foreground">
                Moderasi Komentar
              </h2>
            </div>

            <div className="space-y-6">
              {Object.keys(groupedComments).length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-border rounded-xl text-muted-foreground">
                  Belum ada komentar sama sekali.
                </div>
              ) : (
                Object.entries(groupedComments).map(([slug, slugComments]) => (
                  <div
                    key={slug}
                    className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs"
                        >
                          /{slug}
                        </Badge>
                        {slugComments[0]?.page_url && (
                          <a
                            href={slugComments[0].page_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition"
                          >
                            Kunjungi Halaman ↗
                          </a>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        {slugComments.length} Komentar
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                      {slugComments.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-lg bg-secondary/20 border border-border/50 relative group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden shrink-0 relative">
                              {c.profiles?.avatar_url && (
                                <Image
                                  src={c.profiles.avatar_url}
                                  alt="avatar"
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold">
                                  {c.profiles?.full_name}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(c.created_at).toLocaleDateString(
                                    "id-ID",
                                  )}
                                </span>
                              </div>
                              <div
                                className="text-sm text-foreground/80 leading-relaxed prose dark:prose-invert prose-sm max-w-none line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: c.content }}
                              />
                            </div>

                            <AdminDeleteButton commentId={c.id} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
