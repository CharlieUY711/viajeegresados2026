"use client";

import { useState, useRef } from "react";
import { Upload, Download, Trash2, File, FileText, Search, FolderOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { useDocuments } from "@/hooks/useData";
import { useAuth } from "@/hooks/useAuth";

function getIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return <FileText size={18} className="text-red-500" />;
  if (ext === "doc" || ext === "docx") return <FileText size={18} className="text-blue-500" />;
  if (ext === "xls" || ext === "xlsx") return <FileText size={18} className="text-emerald-500" />;
  return <File size={18} className="text-navy-400" />;
}

function formatSize(bytes: number) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DocumentsPage() {
  const { user } = useAuth();
  const { documents, loading, uploadDocument, deleteDocument } = useDocuments();
  const docs = documents ?? [];

  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter((d: any) =>
    d.filename?.toLowerCase().includes(search.toLowerCase()) ||
    d.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadDocument(file, user.id, { category: "other" });
      }
    } catch (err) {
      console.error(err);
      alert("Error al subir archivo");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (doc: any) => {
    if (!confirm("Eliminar este documento?")) return;
    try {
      await deleteDocument(doc);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  const getName = (doc: any) => doc.filename ?? doc.name ?? "Sin nombre";
  const getUrl  = (doc: any) => doc.public_url ?? doc.url ?? "#";
  const getSize = (doc: any) => doc.size ?? doc.file_size ?? 0;
  const getDate = (doc: any) => doc.uploaded_at ?? doc.created_at ?? "";

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-cream-200 rounded-xl px-3 py-2 flex-1 min-w-[200px] shadow-card">
          <Search size={14} className="text-navy-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar documento..."
            className="bg-transparent text-sm text-navy-700 placeholder:text-navy-300 outline-none flex-1"
          />
        </div>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleUpload} />
        <Button icon={<Upload size={14} />} onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? "Subiendo..." : "Subir documento"}
        </Button>
      </div>
      <p className="text-xs text-navy-400">{filtered.length} documento{filtered.length !== 1 ? "s" : ""}</p>
      {loading ? (
        <div className="text-center py-16 text-navy-400">Cargando...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={24} />}
          title="Sin documentos"
          description="Subi el primer documento del viaje"
          action={<Button icon={<Upload size={14} />} onClick={() => inputRef.current?.click()}>Subir documento</Button>}
        />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-cream-100">
            {filtered.map((doc: any) => (
              <div key={doc.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream-50 transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-cream-100 flex items-center justify-center flex-shrink-0">
                  {getIcon(getName(doc))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-800 truncate">{getName(doc)}</p>
                  <p className="text-xs text-navy-400 mt-0.5">{formatSize(getSize(doc))} - {formatDate(getDate(doc))}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={getUrl(doc)} target="_blank" rel="noopener noreferrer" download className="p-2 rounded-lg text-navy-300 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                    <Download size={14} />
                  </a>
                  <button onClick={() => handleDelete(doc)} className="p-2 rounded-lg text-navy-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
