"use client";

import { useState } from "react";
import { Plus, Calendar, List, MapPin, Users, Edit2, Trash2, Search, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge, Modal, EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { formatDate, cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import type { Event, EventCategory, EventStatus } from "@/types";

const CATEGORY_STYLES: Record<EventCategory, { bg: string; text: string }> = {
  fundraising: { bg: "bg-emerald-100", text: "text-emerald-700" },
  social:      { bg: "bg-purple-100",  text: "text-purple-700"  },
  meeting:     { bg: "bg-blue-100",    text: "text-blue-700"    },
  trip:        { bg: "bg-amber-100",   text: "text-amber-700"   },
};

const STATUS_BADGE: Record<EventStatus, { label: string; variant: "success" | "info" | "warning" | "default" }> = {
  upcoming:  { label: "Proximo",    variant: "info"    },
  ongoing:   { label: "En curso",   variant: "success" },
  completed: { label: "Finalizado", variant: "default" },
  cancelled: { label: "Cancelado",  variant: "warning" },
};

const CATEGORY_EMOJIS: Record<EventCategory, string> = {
  fundraising: "Recaudacion", social: "Social", meeting: "Reunion", trip: "Viaje",
};

const DEFAULT_FORM = {
  title: "", description: "", date: "", location: "",
  category: "social" as EventCategory, max_participants: "",
};

export default function EventsPage() {
  const { t } = useLang();
  const ev = t.events;
  const { user } = useAuth();
  const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();

  const [view, setView]                 = useState<"list" | "calendar">("list");
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState<EventStatus | "all">("all");
  const [modalOpen, setModalOpen]       = useState(false);
  const [editEvent, setEditEvent]       = useState<Event | null>(null);
  const [form, setForm]                 = useState(DEFAULT_FORM);
  const [saving, setSaving]             = useState(false);

  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openCreate = () => { setForm(DEFAULT_FORM); setEditEvent(null); setModalOpen(true); };
  const openEdit = (e: Event) => {
    setEditEvent(e);
    setForm({
      title: e.title, description: e.description,
      date: e.date.slice(0, 16), location: e.location ?? "",
      category: e.category, max_participants: e.max_participants?.toString() ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.date || !user) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        date: new Date(form.date).toISOString(),
        location: form.location || undefined,
        category: form.category,
        status: "upcoming" as EventStatus,
        max_participants: form.max_participants ? parseInt(form.max_participants) : null,
        current_participants: 0,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      };
      if (editEvent) {
        await updateEvent(editEvent.id, payload);
      } else {
        await createEvent(payload);
      }
      setModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Error al guardar el evento");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este evento?")) return;
    try {
      await deleteEvent(id);
    } catch (e) {
      console.error(e);
      alert("Error al eliminar");
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-cream-200 rounded-xl px-3 py-2 flex-1 min-w-[200px] shadow-card">
          <Search size={14} className="text-navy-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar evento..." className="bg-transparent text-sm text-navy-700 placeholder:text-navy-300 outline-none flex-1" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as EventStatus | "all")} className="input-base bg-white !py-2 !rounded-xl w-auto">
          <option value="all">Todos los estados</option>
          <option value="upcoming">Proximos</option>
          <option value="ongoing">En curso</option>
          <option value="completed">Finalizados</option>
          <option value="cancelled">Cancelados</option>
        </select>
        <Button icon={<Plus size={15} />} onClick={openCreate}>{ev.newEvent}</Button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-navy-400">Cargando eventos...</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Calendar size={24} />} title={ev.empty.title} description={ev.empty.desc} action={<Button icon={<Plus size={14} />} onClick={openCreate}>{ev.newEvent}</Button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => {
            const catStyle  = CATEGORY_STYLES[e.category];
            const statusCfg = STATUS_BADGE[e.status];
            const fillPct   = e.max_participants && e.current_participants != null
              ? Math.round((e.current_participants / e.max_participants) * 100) : null;
            return (
              <Card key={e.id} className="hover:shadow-card-hover transition-all duration-200 group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-amber-600 uppercase leading-none">{formatDate(e.date, "MMM")}</span>
                    <span className="text-xl font-bold text-amber-700 leading-none">{formatDate(e.date, "d")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-navy-900">{e.title}</h3>
                          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", catStyle.bg, catStyle.text)}>
                            {CATEGORY_EMOJIS[e.category]}
                          </span>
                          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                        </div>
                        <p className="text-sm text-navy-500 mt-1">{e.description}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(e)} className="p-2 rounded-lg text-navy-300 hover:bg-amber-50 hover:text-amber-600 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(e.id)} className="p-2 rounded-lg text-navy-300 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-4 mt-2 text-xs text-navy-400">
                      <span className="flex items-center gap-1"><Clock size={11} />{formatDate(e.date, "HH:mm")}</span>
                      {e.location && <span className="flex items-center gap-1"><MapPin size={11} />{e.location}</span>}
                      {e.max_participants && <span className="flex items-center gap-1"><Users size={11} />{e.current_participants ?? 0}/{e.max_participants}</span>}
                    </div>
                    {fillPct !== null && (
                      <div className="mt-2 flex items-center gap-2 max-w-xs">
                        <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${fillPct}%` }} />
                        </div>
                        <span className="text-xs text-navy-400">{fillPct}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editEvent ? ev.editModal : ev.createModal} size="lg">
        <div className="space-y-4">
          <div>
            <label className="label-base">Titulo *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-base" placeholder="Nombre del evento" />
          </div>
          <div>
            <label className="label-base">Descripcion</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-base resize-none" rows={3} placeholder="Descripcion del evento" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Fecha y hora *</label>
              <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="label-base">Categoria</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as EventCategory })} className="input-base">
                <option value="social">Social</option>
                <option value="fundraising">Recaudacion</option>
                <option value="meeting">Reunion</option>
                <option value="trip">Viaje</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Lugar</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-base" placeholder="Lugar del evento" />
            </div>
            <div>
              <label className="label-base">Max. participantes</label>
              <input type="number" value={form.max_participants} onChange={e => setForm({ ...form, max_participants: e.target.value })} className="input-base" placeholder="Sin limite" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.date}>
              {saving ? "Guardando..." : editEvent ? "Guardar cambios" : "Crear evento"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
