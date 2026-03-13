"use client";

import { useState } from "react";
import { Plus, Calendar, List, MapPin, Users, Edit2, Trash2, Search, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge, Modal, EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { formatDate, cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import type { Event, EventCategory, EventStatus } from "@/types";

const MOCK_EVENTS: Event[] = [
  { id: "1", title: "Noche de Bingo", description: "Bingo benéfico anual en el salón del colegio.", date: "2025-04-15T19:00:00Z", location: "Salón del colegio", category: "fundraising", status: "upcoming", max_participants: 100, current_participants: 64, created_by: "u1", created_at: "2025-03-01T00:00:00Z", updated_at: "2025-03-01T00:00:00Z" },
  { id: "2", title: "Reunión de padres", description: "Reunión trimestral de planificación del viaje.", date: "2025-04-20T18:00:00Z", location: "Biblioteca", category: "meeting", status: "upcoming", created_by: "u1", created_at: "2025-03-05T00:00:00Z", updated_at: "2025-03-05T00:00:00Z" },
  { id: "3", title: "Lavado de autos", description: "Lavado de autos solidario para recaudar fondos.", date: "2025-04-27T09:00:00Z", location: "Estacionamiento", category: "fundraising", status: "upcoming", max_participants: 30, current_participants: 18, created_by: "u1", created_at: "2025-03-10T00:00:00Z", updated_at: "2025-03-10T00:00:00Z" },
  { id: "4", title: "Fiesta de lanzamiento", description: "Festejo de inicio de la planificación del viaje.", date: "2025-03-10T17:00:00Z", location: "Centro comunitario", category: "social", status: "completed", created_by: "u1", created_at: "2025-02-20T00:00:00Z", updated_at: "2025-03-10T00:00:00Z" },
  { id: "5", title: "¡Viaje de egresados! 🎓", description: "¡El evento principal! 7 días en Punta Cana.", date: "2025-05-23T06:00:00Z", end_date: "2025-05-30T22:00:00Z", location: "Punta Cana, República Dominicana", category: "trip", status: "upcoming", max_participants: 48, current_participants: 48, created_by: "u1", created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z" },
];

const CATEGORY_STYLES: Record<EventCategory, { bg: string; text: string; dot: string }> = {
  fundraising: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-400" },
  social:      { bg: "bg-purple-100",  text: "text-purple-700",  dot: "bg-purple-400"  },
  meeting:     { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-400"    },
  trip:        { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400"   },
};

const STATUS_BADGE: Record<EventStatus, { label: string; variant: "success" | "info" | "warning" | "default" }> = {
  upcoming:  { label: "Próximo",    variant: "info"    },
  ongoing:   { label: "En curso",   variant: "success" },
  completed: { label: "Finalizado", variant: "default" },
  cancelled: { label: "Cancelado",  variant: "warning" },
};

const CATEGORY_EMOJIS: Record<EventCategory, string> = {
  fundraising: "💰", social: "🎉", meeting: "📋", trip: "✈️",
};

const DEFAULT_FORM = { title: "", description: "", date: "", location: "", category: "social" as EventCategory, max_participants: "" };

export default function EventsPage() {
  const { t } = useLang();
  const ev = t.events;

  const [view, setView]           = useState<"list" | "calendar">("list");
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState<EventStatus | "all">("all");
  const [filterCategory, setFilterCategory] = useState<EventCategory | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [form, setForm]           = useState(DEFAULT_FORM);

  const events = MOCK_EVENTS.filter((e) => {
    const matchSearch   = e.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = filterStatus   === "all" || e.status   === filterStatus;
    const matchCategory = filterCategory === "all" || e.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const openCreate = () => { setForm(DEFAULT_FORM); setEditEvent(null); setModalOpen(true); };
  const openEdit   = (e: Event) => {
    setEditEvent(e);
    setForm({ title: e.title, description: e.description, date: e.date.slice(0, 16), location: e.location ?? "", category: e.category, max_participants: e.max_participants?.toString() ?? "" });
    setModalOpen(true);
  };

  // Summary counts
  const counts = {
    all:       MOCK_EVENTS.length,
    upcoming:  MOCK_EVENTS.filter(e => e.status === "upcoming").length,
    completed: MOCK_EVENTS.filter(e => e.status === "completed").length,
  };

  return (
    <div className="space-y-5 page-enter">

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: `${counts.all} en total`,       key: "all"       as const, color: "bg-navy-100 text-navy-700"     },
          { label: `${counts.upcoming} próximos`,  key: "upcoming"  as const, color: "bg-blue-100 text-blue-700"     },
          { label: `${counts.completed} pasados`,  key: "completed" as const, color: "bg-navy-50 text-navy-500"      },
        ].map(({ label, key, color }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
              filterStatus === key ? color + " border-current" : "bg-white border-cream-200 text-navy-500 hover:border-navy-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-cream-200 rounded-xl px-3 py-2 flex-1 min-w-[200px] shadow-card">
          <Search size={14} className="text-navy-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={ev.searchPlaceholder} className="bg-transparent text-sm text-navy-700 placeholder:text-navy-300 outline-none flex-1" />
        </div>

        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as EventCategory | "all")} className="input-base bg-white !py-2 !rounded-xl w-auto">
          <option value="all">Todas las categorías</option>
          {(["fundraising", "social", "meeting", "trip"] as EventCategory[]).map(cat => (
            <option key={cat} value={cat}>{CATEGORY_EMOJIS[cat]} {ev.categories[cat]}</option>
          ))}
        </select>

        <div className="flex bg-white border border-cream-200 rounded-xl overflow-hidden shadow-card">
          {(["list", "calendar"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn("p-2.5 transition-colors", view === v ? "bg-navy-900 text-white" : "text-navy-400 hover:text-navy-700")}>
              {v === "list" ? <List size={15} /> : <Calendar size={15} />}
            </button>
          ))}
        </div>

        <Button icon={<Plus size={15} />} onClick={openCreate}>{ev.newEvent}</Button>
      </div>

      {events.length === 0 ? (
        <EmptyState icon={<Calendar size={24} />} title={ev.empty.title} description={ev.empty.desc} action={<Button icon={<Plus size={14} />} onClick={openCreate}>{ev.newEvent}</Button>} />
      ) : (
        <div className="space-y-3">
          {events.map((e) => {
            const catStyle  = CATEGORY_STYLES[e.category];
            const statusCfg = STATUS_BADGE[e.status];
            const fillPct   = e.max_participants && e.current_participants != null
              ? Math.round((e.current_participants / e.max_participants) * 100)
              : null;

            return (
              <Card key={e.id} className="hover:shadow-card-hover transition-all duration-200 group">
                <div className="flex items-start gap-4">
                  {/* Date badge */}
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center flex-shrink-0 group-hover:border-amber-200 transition-colors">
                    <span className="text-[9px] font-bold text-amber-600 uppercase leading-none">{formatDate(e.date, "MMM")}</span>
                    <span className="text-xl font-bold text-amber-700 leading-none">{formatDate(e.date, "d")}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-navy-900">{e.title}</h3>
                          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1", catStyle.bg, catStyle.text)}>
                            {CATEGORY_EMOJIS[e.category]} {ev.categories[e.category]}
                          </span>
                          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                        </div>
                        <p className="text-sm text-navy-500 mt-1 leading-relaxed">{e.description}</p>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(e)} className="p-2 rounded-lg text-navy-300 hover:bg-amber-50 hover:text-amber-600 transition-colors"><Edit2 size={14} /></button>
                        <button className="p-2 rounded-lg text-navy-300 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>

                    <div className="flex items-center flex-wrap gap-4 mt-2.5 text-xs text-navy-400">
                      <span className="flex items-center gap-1"><Clock size={11} />{formatDate(e.date, "HH:mm")}</span>
                      {e.location && <span className="flex items-center gap-1"><MapPin size={11} />{e.location}</span>}
                      {e.max_participants && <span className="flex items-center gap-1"><Users size={11} />{e.current_participants ?? 0}/{e.max_participants}</span>}
                      {e.end_date && <span>hasta {formatDate(e.end_date)}</span>}
                    </div>

                    {fillPct !== null && (
                      <div className="mt-2.5 flex items-center gap-2 max-w-xs">
                        <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", fillPct >= 100 ? "bg-emerald-400" : "bg-amber-400")}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-navy-400 flex-shrink-0">{fillPct}%{fillPct >= 100 ? " completo" : ""}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editEvent ? ev.editModal : ev.createModal} size="lg">
        <div className="space-y-4">
          <div>
            <label className="label-base">{ev.fields.title}</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-base" placeholder={ev.fields.titlePlaceholder} />
          </div>
          <div>
            <label className="label-base">{ev.fields.description}</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-base resize-none" rows={3} placeholder={ev.fields.descPlaceholder} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">{ev.fields.dateTime}</label>
              <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="label-base">{ev.fields.category}</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as EventCategory })} className="input-base">
                {(["social", "fundraising", "meeting", "trip"] as EventCategory[]).map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_EMOJIS[cat]} {ev.categories[cat]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">{ev.fields.location}</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-base" placeholder={ev.fields.locationPlaceholder} />
            </div>
            <div>
              <label className="label-base">{ev.fields.maxParticipants}</label>
              <input type="number" value={form.max_participants} onChange={e => setForm({ ...form, max_participants: e.target.value })} className="input-base" placeholder={ev.fields.maxPlaceholder} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>{ev.cancel}</Button>
            <Button>{editEvent ? ev.saveChanges : ev.create}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
