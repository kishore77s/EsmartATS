"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { jsPDF } from "jspdf";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Download,
  FileText,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange?: (html: string) => void;
  onDownloadPdf?: () => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  // Convert plain text to HTML with basic structure
  const initialContent = content
    .split("\n\n")
    .map((paragraph) => {
      // Check if it looks like a heading
      const trimmed = paragraph.trim();
      if (
        trimmed.match(
          /^(SUMMARY|EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|CONTACT|OBJECTIVE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE)/i
        )
      ) {
        return `<h2>${trimmed}</h2>`;
      }
      // Check if it looks like a name (usually at the top, all caps or title case)
      if (trimmed.length < 50 && trimmed === trimmed.toUpperCase() && !trimmed.includes(":")) {
        return `<h1>${trimmed}</h1>`;
      }
      return `<p>${paragraph.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  if (!editor) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-slate-50 rounded-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = margin;

    // Get plain text from editor
    const element = document.createElement("div");
    element.innerHTML = editor.getHTML();

    const processNode = (node: ChildNode) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      if (node.nodeType === Node.TEXT_NODE) {
        return;
      }

      const el = node as HTMLElement;
      const tagName = el.tagName?.toLowerCase();
      const text = el.textContent?.trim() || "";

      if (!text) return;

      switch (tagName) {
        case "h1":
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          const h1Lines = doc.splitTextToSize(text, maxWidth);
          h1Lines.forEach((line: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(line, pageWidth / 2, yPosition, { align: "center" });
            yPosition += 8;
          });
          yPosition += 4;
          break;

        case "h2":
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          if (yPosition > margin + 10) yPosition += 6;
          const h2Lines = doc.splitTextToSize(text, maxWidth);
          h2Lines.forEach((line: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += 7;
          });
          yPosition += 2;
          break;

        case "h3":
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          const h3Lines = doc.splitTextToSize(text, maxWidth);
          h3Lines.forEach((line: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += 6;
          });
          yPosition += 2;
          break;

        case "li":
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          const bulletText = `• ${text}`;
          const liLines = doc.splitTextToSize(bulletText, maxWidth - 5);
          liLines.forEach((line: string, index: number) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(index === 0 ? line : `  ${line}`, margin + 5, yPosition);
            yPosition += 5;
          });
          break;

        case "p":
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          const pLines = doc.splitTextToSize(text, maxWidth);
          pLines.forEach((line: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += 5;
          });
          yPosition += 3;
          break;

        default:
          // Process children
          el.childNodes.forEach(processNode);
      }
    };

    element.childNodes.forEach(processNode);
    doc.save("edited-resume.pdf");
  };

  const handleDownloadTxt = () => {
    const text = editor.getText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited-resume.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ToolButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive
          ? "bg-primary-100 text-primary-700"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-4 py-3 border-b border-slate-200 bg-slate-50">
        {/* Undo/Redo */}
        <ToolButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolButton>

        <div className="w-px h-6 bg-slate-300 mx-2" />

        {/* Headings */}
        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolButton>

        <div className="w-px h-6 bg-slate-300 mx-2" />

        {/* Text formatting */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolButton>

        <div className="w-px h-6 bg-slate-300 mx-2" />

        {/* Lists */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolButton>

        <div className="w-px h-6 bg-slate-300 mx-2" />

        {/* Alignment */}
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolButton>

        <div className="flex-1" />

        {/* Download buttons */}
        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
        <button
          onClick={handleDownloadTxt}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <FileText className="w-4 h-4" />
          TXT
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-6 min-h-[500px] focus:outline-none [&_.ProseMirror]:min-h-[480px] [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mt-6 [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:text-primary-700 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-medium [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_p]:mb-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6"
      />
    </div>
  );
}
