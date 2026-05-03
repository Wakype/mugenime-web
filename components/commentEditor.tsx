"use client";

// Tambahkan Node pada import
import {
  useEditor,
  EditorContent,
  mergeAttributes,
  Mark,
  Node,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExtension from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  ImageIcon,
  Send,
  Loader2,
  Link as LinkIcon,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    spoiler: {
      toggleSpoiler: () => ReturnType;
    };
  }
}

// --- CUSTOM NODE: MENTION TAG ---
const MentionTag = Node.create({
  name: "mentionTag",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true, // Membuatnya dihapus sekaligus saat ditekan backspace

  addAttributes() {
    return {
      label: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-mention]",
        getAttrs: (dom) => {
          if (typeof dom === "string") return {};
          return {
            label: dom.getAttribute("data-label"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-mention": "true",
        class:
          "bg-primary/15 text-primary border border-primary/20 px-1.5 py-0.5 rounded-md font-bold mr-1 inline-block select-none pointer-events-none",
        contenteditable: "false", // Mencegah teks di dalam tag bisa diedit
      }),
      HTMLAttributes.label,
    ];
  },
});

// Custom Mark Extension
const Spoiler = Mark.create({
  name: "spoiler",

  parseHTML() {
    return [
      {
        tag: "span[data-spoiler]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-spoiler": "true",
        class: "spoiler-text",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleSpoiler:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-s": () => this.editor.commands.toggleSpoiler(),
    };
  },
});

const UCImage = ImageExtension.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      {
        class:
          "uc-image-wrapper relative inline-block group cursor-zoom-in my-1 align-top w-max max-w-full after:content-[attr(data-label)] after:absolute after:bottom-2 after:left-2 after:bg-black/80 after:text-white after:text-[10px] after:font-bold after:px-2 after:py-1 after:rounded after:pointer-events-none after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        "data-label": "Original Size",
      },
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          class:
            "uc-image max-h-[250px] w-auto rounded-lg object-contain transition-all duration-300 m-0 block",
        }),
      ],
    ];
  },
});

interface CommentEditorProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  initialContent?: string;
  submitLabel?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}

const activeClass =
  "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground";
const inactiveClass =
  "text-muted-foreground hover:bg-muted hover:text-foreground";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ElementType;
  tooltip: string;
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
  tooltip,
}: ToolbarButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClick}
        className={cn(
          "h-8 w-8 rounded-lg cursor-pointer",
          isActive ? activeClass : inactiveClass,
        )}
      >
        <Icon className="w-4 h-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="top" className="text-xs font-semibold">
      {tooltip}
    </TooltipContent>
  </Tooltip>
);

export default function CommentEditor({
  onSubmit,
  isLoading,
  initialContent = "",
  submitLabel = "Kirim",
  onCancel,
  autoFocus = false,
}: Readonly<CommentEditorProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const [, setTick] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: autoFocus ? "end" : false,
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Spoiler,
      UCImage.configure({
        inline: true,
        allowBase64: true,
      }),
      MentionTag, // <--- Daftarkan Ekstensi MentionTag Disini
      Placeholder.configure({
        placeholder: "Tulis komentarmu di sini...",
        emptyEditorClass:
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-muted-foreground before:opacity-60 before:pointer-events-none",
      }),
    ],
    content: initialContent,
    onUpdate: () => setTick((t) => t + 1),
    onTransaction: () => setTick((t) => t + 1),
    onSelectionUpdate: () => setTick((t) => t + 1),
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] max-h-[400px] overflow-y-auto p-4 prose-ul:list-disc prose-ol:list-decimal prose-ul:ml-4 prose-ol:ml-4 prose-p:my-1 prose-img:m-0",
      },
    },
  });

  const isEditorEmpty = editor ? editor.isEmpty : !initialContent;

  if (!editor) return null;

  const handleSubmit = () => {
    if (editor.isEmpty) return;
    const htmlContent = editor.getHTML();
    onSubmit(htmlContent);
    if (!initialContent) {
      editor.commands.clearContent();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          editor.chain().focus().setImage({ src: result }).run();
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submitImageUrl = () => {
    if (imageUrlInput.trim()) {
      editor.chain().focus().setImage({ src: imageUrlInput }).run();
      setImageUrlInput("");
      setIsLinkDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col border border-border rounded-xl bg-card shadow-sm overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all mt-2">
      <TooltipProvider delayDuration={200}>
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            tooltip="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            tooltip="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={UnderlineIcon}
            tooltip="Underline (Ctrl+U)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            tooltip="Strikethrough"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            icon={Highlighter}
            tooltip="Highlight"
          />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSpoiler().run()}
            isActive={editor.isActive("spoiler")}
            icon={EyeOff}
            tooltip="Spoiler (Ctrl+Shift+S)"
          />

          <div className="w-px h-5 bg-border mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={List}
            tooltip="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={ListOrdered}
            tooltip="Numbered List"
          />

          <div className="w-px h-5 bg-border mx-1" />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*, image/gif"
            className="hidden"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "h-8 w-8 rounded-lg cursor-pointer",
                  inactiveClass,
                )}
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs font-semibold">
              Upload Gambar/GIF
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsLinkDialogOpen(true)}
                className={cn(
                  "h-8 w-8 rounded-lg cursor-pointer",
                  inactiveClass,
                )}
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs font-semibold">
              Insert Gambar dari Link
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="relative bg-background">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between p-3 border-t border-border bg-muted/10">
        <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline-block">
          Mendukung Markdown, Spoiler, Gambar, dan GIF
        </span>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              className="h-8 px-4 text-xs font-bold rounded-lg cursor-pointer"
            >
              Batal
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isEditorEmpty}
            className="h-8 px-4 text-xs font-bold rounded-lg shadow-md shadow-primary/20 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
            ) : (
              <Send className="w-3 h-3 mr-1.5" />
            )}
            {submitLabel}
          </Button>
        </div>
      </div>

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Masukkan URL Gambar</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Input
              type="url"
              placeholder="https://contoh.com/gambar.jpg"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitImageUrl()}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsLinkDialogOpen(false)}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={submitImageUrl}
              disabled={!imageUrlInput.trim()}
              className="cursor-pointer"
            >
              Sisipkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
