"use client";

import { useState, useRef } from "react";
import { Upload, X, ZoomIn, ChevronLeft, ChevronRight, Image as ImageIcon, Grid3X3, Grid2X2, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui";
import { useLang } from "@/lib/i18n";
import { formatRelativeDate, cn } from "@/lib/utils";

interface Photo { id: string; url: string; uploader: string; event?: string; uploaded_at: string; liked?: boolean; }

const MOCK_PHOTOS: Photo[] = [
  { id: "1",  url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80", uploader: "Ana López",     event: "Fiesta de lanzamiento", uploaded_at: "2025-04-08T10:00:00Z" },
  { id: "2",  url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80", uploader: "Carlos R.",     event: "Noche de Bingo",        uploaded_at: "2025-04-06T18:30:00Z" },
  { id: "3",  url: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&q=80", uploader: "María García",                                  uploaded_at: "2025-04-05T09:00:00Z" },
  { id: "4",  url: "https://images.unsplash.com/photo-1612213995754-58b02de09823?w=600&q=80", uploader: "Pedro M.",      event: "Noche de Bingo",        uploaded_at: "2025-04-03T20:00:00Z" },
  { id: "5",  url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", uploader: "Lucía F.",                                      uploaded_at: "2025-04-02T14:00:00Z" },
  { id: "6",  url: "https://images.unsplash.com/photo-1595654383550-e84f14b4d97f?w=600&q=80", uploader: "Diego M.",      event: "Lavado de autos",       uploaded_at: "2025-03-30T11:00:00Z" },
  { id: "7",  url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80", uploader: "Valentina C.",                                  uploaded_at: "2025-03-28T16:00:00Z" },
  { id: "8",  url: "https://images.unsplash.com/photo-1548449112-96a38a643324?w=600&q=80",    uploader: "Isabela R.",    event: "Fiesta de lanzamiento", uploaded_at: "2025-03-25T12:00:00Z" },
  { id: "9",  url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", uploader: "Ana López",                                     uploaded_at: "2025-03-20T09:30:00Z" },
  { id: "10", url: "https://images.unsplash.com/photo-1544085311-11a028465b03?w=600&q=80",    uploader: "Juan Pérez",                                    uploaded_at: "2025-03-18T17:00:00Z" },
  { id: "11", url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80", uploader: "Sofía Torres",  event: "Lavado de autos",       uploaded_at: "2025-03-15T10:00:00Z" },
  { id: "12", url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&q=80", uploader: "María García",                                  uploaded_at: "2025-03-10T08:00:00Z" },
];

type GridSize = "sm" | "md" | "lg";
const GRID_COLS: Record<GridSize, string> = {
  sm: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8",
  md: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  lg: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export default function GalleryPage() {
  const { t } = useLang();
  const g = t.gallery;

  const [photos, setPhotos] = useState<Photo[]>(MOCK_PHOTOS);
  const [selected, setSelected]     = useState<Photo | null>(null);
  const [filterEvent, setFilterEvent] = useState("all");
  const [gridSize, setGridSize]     = useState<GridSize>("md");
  const inputRef = useRef<HTMLInputElement>(null);

  const events = ["all", ...Array.from(new Set(photos.map(p => p.event).filter(Boolean) as string[]))];
  const filtered = filterEvent === "all" ? photos : photos.filter(p => p.event === filterEvent);
  const selectedIdx = selected ? filtered.findIndex(p => p.id === selected.id) : -1;

  const prev = () => selectedIdx > 0 && setSelected(filtered[selectedIdx - 1]);
  const next = () => selectedIdx < filtered.length - 1 && setSelected(filtered[selectedIdx + 1]);

  const toggleLike = (id: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
  };

  return (
    <div className="space-y-5 page-enter">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Event filter chips */}
        <div className="flex gap-1.5 flex-wrap flex-1">
          {events.map(ev => (
            <button
              key={ev}
              onClick={() => setFilterEvent(ev)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                filterEvent === ev
                  ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                  : "bg-white border-cream-200 text-navy-500 hover:border-navy-300 hover:text-navy-700"
              )}
            >
              {ev === "all" ? `📸 ${g.allPhotos} (${photos.length})` : ev}
            </button>
          ))}
        </div>

        {/* Grid size */}
        <div className="flex bg-white border border-cream-200 rounded-xl overflow-hidden shadow-card">
          {([["sm", <Grid3X3 size={14} />], ["md", <Grid2X2 size={14} />]] as const).map(([size, icon]) => (
            <button
              key={size}
              onClick={() => setGridSize(size as GridSize)}
              className={cn("p-2.5 transition-colors", gridSize === size ? "bg-navy-900 text-white" : "text-navy-400 hover:text-navy-700")}
            >
              {icon}
            </button>
          ))}
        </div>

        <input ref={inputRef} type="file" accept="image/*,video/*" multiple className="hidden" />
        <Button icon={<Upload size={14} />} onClick={() => inputRef.current?.click()}>{g.upload}</Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs text-navy-400">
        <span>{filtered.length} {g.photos}</span>
        <span>·</span>
        <span>{photos.filter(p => p.liked).length} me gusta</span>
        <span>·</span>
        <span>{events.length - 1} eventos</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ImageIcon size={24} />} title={g.empty.title} description={g.empty.desc} action={<Button icon={<Upload size={14} />}>{g.upload}</Button>} />
      ) : (
        <div className={cn("grid gap-2", GRID_COLS[gridSize])}>
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-cream-200 cursor-pointer shadow-card"
              onClick={() => setSelected(photo)}
            >
              <img src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition-all duration-200" />

              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ZoomIn size={22} className="text-white drop-shadow-lg" />
              </div>

              {/* Event tag */}
              {photo.event && (
                <div className="absolute top-2 left-2 bg-navy-900/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.event}
                </div>
              )}

              {/* Like button */}
              <button
                onClick={e => { e.stopPropagation(); toggleLike(photo.id); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40"
              >
                <Heart size={12} className={photo.liked ? "text-red-400 fill-red-400" : "text-white"} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/92 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-4xl w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-11 right-0 w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>

            <img
              src={selected.url}
              alt=""
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-navy-950/75 backdrop-blur-sm rounded-b-2xl px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-semibold">{selected.uploader}</p>
                <p className="text-white/50 text-xs">{formatRelativeDate(selected.uploaded_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                {selected.event && (
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
                    {selected.event}
                  </span>
                )}
                <button
                  onClick={e => { e.stopPropagation(); toggleLike(selected.id); }}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Heart size={16} className={selected.liked ? "text-red-400 fill-red-400" : "text-white/60"} />
                </button>
              </div>
            </div>

            {selectedIdx > 0 && (
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {selectedIdx < filtered.length - 1 && (
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all"
              >
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
