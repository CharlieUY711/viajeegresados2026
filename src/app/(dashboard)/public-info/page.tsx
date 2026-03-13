"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pin, Share2, Copy, Check, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import { publicInfoService, CATEGORY_META } from "@/services/publicInfoService";
import { useAuth } from "@/hooks/useAuth";
import type { PublicInfo, PublicInfoCategory } from "@/types";

const CATEGORIES = Object.keys(CATEGORY_META) as PublicInfoCategory[];

// ─── Share button ─────────────────────────────────────────────────────────────
function ShareButton({ item }: { item: PublicInfo }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = publicInfoService.getShareText(item);
    if (navigator.share) {
      await navigator.share({ title: item.title, text });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-1.5 rounded-lg text-navy-300 hover:text-navy-600 hover:bg-cream-100 transition-all"
      title="Compartir"
    >
      {copied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
    </button>
  );
}

// ─── Info card ────────────────────────────────────────────────────────────────
function InfoCard({
  item,
  canEdit,
  onDelete,
  onTogglePin,
}: {
  item: PublicInfo;
  canEdit: boolean;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, pinned: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[item.category];
  const isLong = item.content.length > 180;

  return (
    <Card className={cn("space-y-2 transition-all", item.is_pinned && "ring-1 ring-navy-500/20")}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {item.is_pinned && <Pin size={12} className="text-navy-500 flex-shrink-0" />}
          <span className="text-base">{meta.icon}</span>
          <h3 className="text-sm font-bold text-navy-900 flex-1 min-w-0">{item.title}</h3>
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", meta.color)}>
            {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <ShareButton item={item} />
          {canEdit && (
            <>
              <button
                onClick={() => onTogglePin(item.id, !item.is_pinned)}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  item.is_pinned
                    ? "text-navy-500 bg-navy-50"
                    : "text-navy-300 hover:text-navy-600 hover:bg-cream-100"
                )}
                title={item.is_pinned ? "Desfijar" : "Fijar"}
              >
                <Pin size={13} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 rounded-lg text-navy-300 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Eliminar"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="text-sm text-navy-700 leading-relaxed">
        {isLong && !expanded
          ? <>{item.content.slice(0, 180)}...</>
          : item.content
        }
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs text-navy-400 hover:text-navy-600 transition-colors"
        >
          {expanded ? <><ChevronUp size={12} /> Ver menos</> : <><ChevronDown size={12} /> Ver más</>}
        </button>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-cream-100">
        <p className="text-[10px] text-navy-400">
          Por {item.author?.full_name ?? "Admin"} · {new Date(item.created_at).toLocaleDateString("es")}
        </p>
      </div>
    </Card>
  );
}

// ─── Create modal ─────────────────────────────────────────────────────────────
function CreateModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; content: string; category: PublicInfoCategory; is_pinned: boolean }) => Promise<void>;
}) {
  const [form, setForm] = useState<{
    title: string;
    content: string;
    category: PublicInfoCategory;
    is_pinned: boolean;
  }>({ title: "", content: "", category: "announcement", is_pinned: false });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title || !form.content) return;
    setSaving(true);
    try { await onSave(form); onClose(); setForm({ title: "", content: "", category: "announcement", is_pinned: false }); }
    catch (e) { console.error(e); alert("Error al guardar"); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nueva entrada" size="md">
      <div className="space-y-4">
        <div>
          <label className="label-base">Categoría</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const m = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
                    form.category === cat ? cn(m.color, "ring-1 ring-offset-1") : "bg-white border-cream-200 text-navy-500"
                  )}
                >
                  {m.icon} {m.label}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="label-base">Título *</label>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="input-base"
            placeholder="Título de la entrada"
          />
        </div>
        <div>
          <label className="label-base">Contenido *</label>
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            className="input-base resize-none"
            rows={5}
            placeholder="Información a compartir..."
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="pinned"
            checked={form.is_pinned}
            onChange={e => setForm(f => ({ ...f, is_pinned: e.target.checked }))}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="pinned" className="text-sm text-navy-700 flex items-center gap-1.5 cursor-pointer">
            <Pin size={13} className="text-navy-500" /> Fijar arriba
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving || !form.title || !form.content}>
            {saving ? "Guardando..." : "Publicar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PublicInfoPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [items, setItems]       = useState<PublicInfo[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterCat, setFilterCat] = useState<PublicInfoCategory | "all">("all");
  const [createModal, setCreateModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await publicInfoService.getAll();
      setItems(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (form: {
    title: string;
    content: string;
    category: PublicInfoCategory;
    is_pinned: boolean;
  }) => {
    if (!user) return;
    const item = await publicInfoService.create({ ...form, created_by: user.id });
    setItems(prev => [item, ...prev].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta entrada?")) return;
    await publicInfoService.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleTogglePin = async (id: string, pinned: boolean) => {
    const updated = await publicInfoService.update(id, { is_pinned: pinned });
    setItems(prev =>
      prev.map(i => i.id === id ? updated : i)
          .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
    );
  };

  const filtered = items.filter(i => {
    const matchCat    = filterCat === "all" || i.category === filterCat;
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5 page-enter">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-cream-200 rounded-xl px-3 py-2 flex-1 min-w-[200px] shadow-card">
          <Search size={14} className="text-navy-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="bg-transparent text-sm text-navy-700 placeholder:text-navy-300 outline-none flex-1"
          />
        </div>
        {isAdmin && (
          <Button icon={<Plus size={14} />} onClick={() => setCreateModal(true)}>
            Nueva entrada
          </Button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCat("all")}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
            filterCat === "all" ? "bg-navy-900 text-white border-navy-900" : "bg-white text-navy-500 border-cream-200"
          )}
        >
          Todas ({items.length})
        </button>
        {CATEGORIES.map(cat => {
          const m = CATEGORY_META[cat];
          const count = items.filter(i => i.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filterCat === cat ? "bg-navy-900 text-white border-navy-900" : cn("bg-white border-cream-200", m.color)
              )}
            >
              {m.icon} {m.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Items */}
      {loading ? (
        <div className="text-center py-16 text-navy-400">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-navy-400">
          <p className="text-sm">No hay entradas todavía.</p>
          {isAdmin && <p className="text-xs mt-1">Creá la primera con el botón de arriba.</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <InfoCard
              key={item.id}
              item={item}
              canEdit={isAdmin}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}

      <CreateModal open={createModal} onClose={() => setCreateModal(false)} onSave={handleCreate} />
    </div>
  );
}
