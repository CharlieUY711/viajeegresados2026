"use client";

import { useState, useRef } from "react";
import { Upload, X, ZoomIn, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui";
import { useLang } from "@/lib/i18n";
import { formatRelativeDate, cn } from "@/lib/utils";
import { useGallery } from "@/hooks/useData";
import { useAuth } from "@/hooks/useAuth";
import type { GalleryItem } from "@/types";

type GridSize = "sm" | "md";
const GRID_COLS: Record<GridSize, string> = {
  sm: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6",
  md: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

export default function GalleryPage() {
  const { t } = useLang();
  const g = t.gallery;
  const { user } = useAuth();
  const { items, loading, uploadItem, deleteItem } = useGallery();

  const [selected, setSelected]       = useState<GalleryItem | null>(null);
  const [filterEvent, setFilterEvent] = useState("all");
  const [gridSize, setGridSize]       = useState<GridSize>("md");
  const [uploading, setUploading]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const events = ["all", ...Array.from(new Set(
    items.map(p => p.event?.title).filter(Boolean) as string[]
  ))];

  const filtered = filterEvent === "all"
    ? items
    : items.filter(p => p.event?.title === filterEvent);

  const selectedIdx = selected ? filtered.findIndex(p => p.id === selected.id) : -1;
  const prev = () => selectedIdx > 0 && setSelected(filtered[selectedIdx - 1]);
  const next = () => selectedIdx < filtered.length - 1 && setSelected(filtered[selectedIdx + 1]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return; if (!user) { alert('Usuario no autenticado'); return; }
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadItem(file, user.id);
      }
    } catch (err) {
      console.error(err);
      alert("Error al subir archivo");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Eliminar esta foto?")) return;
    try {
      await deleteItem(item);
      if (selected?.id === item.id) setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5 flex-wrap flex-1">
          {events.map(ev => (
            <button
              key={ev}
              onClick={() => setFilterEvent(ev)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                filterEvent === ev
                  ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                  : "bg-white border-cream-200 text-navy-500 hover:border-navy-300"
              )}
            >
              {ev === "all" ? `Todas (${items.length})` : ev}
            </button>
          ))}
        </div>
        <div className="flex bg-white border border-cream-200 rounded-xl overflow-hidden shadow-card">
          {(["sm", "md"] as GridSize[]).map(size => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              className={cn("px-3 py-2 text-xs font-semibold transition-colors",
                gridSize === size ? "bg-navy-900 text-white" : "text-navy-400 hover:text-navy-700"
              )}
            >
              {size === "sm" ? "Chico" : "Mediano"}
            </button>
          ))}
        </div>
        <input ref={inputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUpload} />
        <Button icon={<Upload size={14} />} onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? "Subiendo..." : g.upload}
        </Button>
      </div>

      <div className="flex items-center gap-4 text-xs text-navy-400">
        <span>{filtered.length} fotos</span>
        <span>·</span>
        <span>{events.length - 1} eventos</span>
      </div>

      {loading ? (
        <div className="text-center py-16 text-navy-400">Cargando galeria...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Upload size={24} />}
          title={g.empty.title}
          description={g.empty.desc}
          action={<Button icon={<Upload size={14} />} onClick={() => inputRef.current?.click()}>{g.upload}</Button>}
        />
      ) : (
        <div className={cn("grid gap-2", GRID_COLS[gridSize])}>
          {filtered.map(photo => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-cream-200 cursor-pointer shadow-card"
              onClick={() => setSelected(photo)}
            >
              <img src={photo.public_url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition-all duration-200 flex items-center justify-center">
                <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100" />
              </div>
              {photo.event?.title && (
                <div className="absolute top-2 left-2 bg-navy-900/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.event.title}
                </div>
              )}
              <button
                onClick={e => { e.stopPropagation(); handleDelete(photo); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/92 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-11 right-0 w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>
            <img src={selected.public_url} alt="" className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl" />
            <div className="absolute bottom-0 left-0 right-0 bg-navy-950/75 backdrop-blur-sm rounded-b-2xl px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-semibold">{selected.uploader?.full_name ?? "Usuario"}</p>
                <p className="text-white/50 text-xs">{formatRelativeDate(selected.uploaded_at)}</p>
              </div>
              {selected.event?.title && (
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
                  {selected.event.title}
                </span>
              )}
            </div>
            {selectedIdx > 0 && (
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center">
                <ChevronLeft size={20} />
              </button>
            )}
            {selectedIdx < filtered.length - 1 && (
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center">
                <ChevronRight size={20} />
              </button>
            )}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-white/40 text-xs">
              {selectedIdx + 1} / {filtered.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
