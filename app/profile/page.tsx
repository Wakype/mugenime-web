"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  Camera,
  LogOut,
  Check,
  ArrowLeft,
  UploadCloud,
  AlertOctagon,
  Trash2,
  Settings,
  ShieldAlert,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
  const { logout, refreshProfile } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/");
          return;
        }

        // Fetch the latest profile data from the database
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .single();

        setUser(session.user);

        // Use database values first, fallback to metadata if db is somehow empty
        setFullName(
          profile?.full_name || session.user.user_metadata?.full_name || "",
        );
        setAvatarUrl(
          profile?.avatar_url || session.user.user_metadata?.avatar_url || "",
        );
      } catch (error) {
        console.error("Error fetching user session/profile in ProfilePage:", error);
        toast.error("Gagal memuat profil. Silakan coba lagi.");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router, supabase]); // Supabase client itself is stable, so it's safe as dependency

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileSelection(e.target.files[0]);
    e.target.value = "";
  };

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith("image/"))
      return toast.error("Harap upload gambar.");
    if (file.size > 2 * 1024 * 1024) return toast.error("Maksimal 2MB.");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;

      if (selectedFile) {
        // 1. HAPUS FOTO LAMA
        if (avatarUrl?.includes("avatars/")) {
          const oldPath = avatarUrl.split("avatars/").pop();
          if (oldPath) {
            await supabase.storage.from("avatars").remove([oldPath]);
          }
        }

        // 2. UPLOAD FOTO BARU
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);
        finalAvatarUrl = publicUrl;
      }

      // 3. UPDATE AUTH METADATA & TABLE PROFILES
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: finalAvatarUrl },
      });
      if (authError) throw authError;

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ full_name: fullName, avatar_url: finalAvatarUrl })
        .eq("id", user.id);

      if (dbError) throw dbError;

      setAvatarUrl(finalAvatarUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      await refreshProfile();
      toast.success("Profil berhasil diperbarui!");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Gagal menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc("delete_user_account");
      if (error) throw error;
      toast.success("Akun dihapus.");
      router.push("/");
    } catch (error: unknown) {
      toast.error((error as Error).message);
      setIsDeleting(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-red-900/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertOctagon className="w-5 h-5" /> Hapus Akun Permanen?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/80 space-y-2">
              <p>
                Tindakan ini <strong>tidak dapat dibatalkan</strong>. Ini akan
                secara permanen menghapus akun kamu dan menghilangkan data kamu
                (termasuk riwayat tontonan, bookmark, dan pengaturan profil)
                dari peladen kami.
              </p>
              <p className="text-muted-foreground text-xs italic">
                Catatan: Komentar yang sudah kamu tulis mungkin akan tetap ada
                dengan label &quot;Pengguna Dihapus&quot; kecuali kamu
                menghapusnya terlebih dahulu.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Ya, Hapus Akun
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto px-4 space-y-8">
        <Button
          variant="ghost"
          asChild
          className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground cursor-pointer -ml-2"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
          </Link>
        </Button>

        {/* --- HEADER SECTION --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <Settings className="w-3.5 h-3.5" />
                Pengaturan
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Profil <span className="text-primary">Saya</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Kelola informasi pribadi, foto profil, dan pengaturan akun kamu
                di sini.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-full border-border hover:bg-secondary cursor-pointer text-muted-foreground hover:text-foreground font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" /> Keluar Akun
            </Button>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* KOLOM KIRI (Informasi Utama & Upload) */}
          <div className="col-span-1 md:col-span-5 lg:col-span-4 space-y-6">
            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center text-center space-y-4">
              {/* Avatar Preview */}
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-background ring-2 ring-primary/20 shadow-xl bg-secondary flex items-center justify-center group">
                {previewUrl || avatarUrl ? (
                  <Image
                    src={previewUrl || avatarUrl}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-muted-foreground/50" />
                )}
                <div
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="space-y-1 w-full">
                <h2 className="text-xl font-bold text-foreground truncate px-2">
                  {fullName || "Pengguna Mugenime"}
                </h2>
                <p className="text-sm text-muted-foreground truncate px-2">
                  {user?.email}
                </p>
              </div>

              <Separator className="w-1/2 bg-border" />

              {/* Drag and Drop Zone */}
              <div
                className={cn(
                  "w-full relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer overflow-hidden",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50",
                  previewUrl && !dragActive && "border-primary/50 bg-primary/5",
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleFileInput}
                  onClick={(e) => e.stopPropagation()} // Cegah event bubbling yang membatalkan seleksi file
                />
                <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                  <div className="p-3 bg-background rounded-full shadow-sm ring-1 ring-border">
                    <UploadCloud
                      className={cn(
                        "w-5 h-5",
                        previewUrl ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">
                      {previewUrl
                        ? "Gambar siap diunggah"
                        : "Klik atau seret gambar"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Maksimal 2MB (JPEG, PNG, GIF)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (Form & Danger Zone) */}
          <div className="col-span-1 md:col-span-7 lg:col-span-8 space-y-8">
            {/* Form Informasi Pribadi */}
            <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Informasi Pribadi
              </h3>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">
                    Email Terdaftar
                  </label>
                  <Input
                    type="email"
                    value={user?.email}
                    disabled
                    className="bg-muted/50 cursor-not-allowed text-muted-foreground"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Email tidak dapat diubah karena terikat dengan Google Auth.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">
                    Nama Tampilan
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Mugen Lover"
                    className="bg-background focus-visible:ring-primary/50"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving || !fullName.trim()}
                  className="w-full sm:w-auto rounded-xl font-bold shadow-md shadow-primary/20 cursor-pointer h-11 px-8"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Simpan Perubahan
                </Button>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className="bg-red-500/5 dark:bg-red-950/10 rounded-3xl p-6 md:p-8 border border-red-200 dark:border-red-900 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

              <div className="relative z-10 space-y-2">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-500 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  Danger Zone
                </h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 leading-relaxed max-w-2xl">
                  Area ini berisi tindakan yang tidak dapat diubah kembali.
                  Menghapus akun akan memusnahkan akses kamu ke profil, histori,
                  dan fitur komunitas.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-background/50 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-900/50">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    Hapus Akun Permanen
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tindakan ini akan menghapus akun beserta seluruh data secara
                    permanen.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full sm:w-auto rounded-xl font-bold shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus Akun
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
