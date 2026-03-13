"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Lock, Globe, Users, Eye, EyeOff, Crown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import { commissionsService } from "@/services/commissionsService";
import { useAuth } from "@/hooks/useAuth";

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const COLORS = ["emerald", "blue", "purple", "amber", "rose", "indigo"] as const;
type Color = typeof COLORS[number];

const COLOR_MAP: Record<Color, string> = {
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  blue:    "bg-blue-50 border-blue-200 text-blue-700",
  purple:  "bg-purple-50 border-purple-200 text-purple-700",
  amber:   "bg-amber-50 border-amber-200 text-amber-700",
  rose:    "bg-rose-50 border-rose-200 text-rose-700",
  indigo:  "bg-indigo-50 border-indigo-200 text-indigo-700",
};

const STATUS_CFG = {
  completed:   { label: "Completado",  variant: "success" as const, color: "text-emerald-500" },
  in_progress: { label: "En progreso", variant: "info"    as const, color: "text-blue-400"   },
  pending:     { label: "Pendiente",   variant: "default" as const, color: "text-navy-300"   },
};

type TabKey = "tasks" | "notes";

// â”€â”€â”€ Permission Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function getUserRole(commission: any, userId?: string): "lead" | "member" | null {
  if (!userId) return null;
  const membership = commission.members?.find((m: any) => m.user_id === userId);
  if (!membership) return null;
  return membership.role === "lead" ? "lead" : "member";
}

const CAN = {
  seePrivateContent: (role: ReturnType<typeof getUserRole>) => role !== null,
  editContent:       (role: ReturnType<typeof getUserRole>) => role !== null,
  deleteCommission:  (role: ReturnType<typeof getUserRole>) => role === "lead",
};

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function RoleBadge({ role }: { role: ReturnType<typeof getUserRole> }) {
  if (!role) return null;
  if (role === "lead")
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
        <Crown size={10} /> LÃ­der
      </span>
    );
  return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Miembro</span>;
}

function VisibilityIcon({ isPrivate }: { isPrivate: boolean }) {
  return isPrivate
    ? <Lock size={11} className="text-amber-500 flex-shrink-0"  />
    : <Globe size={11} className="text-navy-300 flex-shrink-0" />;
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function CommissionsPage() {
  const { user } = useAuth();

  const [commissions, setCommissions] = useState<any[]>([]);
  const [notes, setNotes]             = useState<Record<string, any[]>>({});
  const [loading, setLoading]         = useState(true);
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [activeTab, setActiveTab]     = useState<Record<string, TabKey>>({});

  const [createModal, setCreateModal] = useState(false);
  const [taskModal, setTaskModal]     = useState<string | null>(null);
  const [noteModal, setNoteModal]     = useState<string | null>(null);

  const [form, setForm]         = useState({ name: "", description: "", color: "blue" as Color });
  const [taskForm, setTaskForm] = useState({ title: "", isPrivate: false });
  const [noteForm, setNoteForm] = useState({ content: "", isPrivate: false });
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await commissionsService.getAll();
      setCommissions(data);
      if (data.length > 0 && !expanded) setExpanded(data[0].id);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadNotes = async (id: string) => {
    try {
      const data = await commissionsService.getNotes(id);
      setNotes(prev => ({ ...prev, [id]: data }));
    } catch (e) { console.error(e); }
  };

  const handleExpand = (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    loadNotes(id);
  };

  const handleCreate = async () => {
    if (!form.name || !user) return;
    setSaving(true);
    try {
      await commissionsService.create(form.name, form.description, form.color, user.id);
      setCreateModal(false);
      setForm({ name: "", description: "", color: "blue" });
      await load();
    } catch (e) { console.error(e); alert("Error al crear la comisiÃ³n"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Â¿Eliminar esta comisiÃ³n?")) return;
    try { await commissionsService.delete(id); await load(); }
    catch (e) { console.error(e); }
  };

  const handleAddTask = async (commissionId: string) => {
    if (!taskForm.title) return;
    setSaving(true);
    try {
      await commissionsService.addTask(commissionId, taskForm.title, taskForm.isPrivate);
      setTaskModal(null);
      setTaskForm({ title: "", isPrivate: false });
      await load();
    } catch (e) { console.error(e); alert("Error al agregar tarea"); }
    finally { setSaving(false); }
  };

  const handleTaskStatus = async (taskId: string, current: string) => {
    const next = current === "pending" ? "in_progress" : current === "in_progress" ? "completed" : "pending";
    try { await commissionsService.updateTaskStatus(taskId, next); await load(); }
    catch (e) { console.error(e); }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Â¿Eliminar esta tarea?")) return;
    try { await commissionsService.deleteTask(taskId); await load(); }
    catch (e) { console.error(e); }
  };

  const handleAddNote = async (commissionId: string) => {
    if (!noteForm.content || !user) return;
    setSaving(true);
    try {
      await commissionsService.addNote(commissionId, noteForm.content, noteForm.isPrivate, user.id);
      setNoteModal(null);
      setNoteForm({ content: "", isPrivate: false });
      await loadNotes(commissionId);
    } catch (e) { console.error(e); alert("Error al agregar nota"); }
    finally { setSaving(false); }
  };

  const handleDeleteNote = async (commissionId: string, noteId: string) => {
    if (!confirm("Â¿Eliminar esta nota?")) return;
    try { await commissionsService.deleteNote(noteId); await loadNotes(commissionId); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-4 page-enter">
      <div className="flex justify-end">
        <Button icon={<Plus size={14} />} onClick={() => setCreateModal(true)}>Nueva comisiÃ³n</Button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-navy-400">Cargando...</div>
      ) : commissions.length === 0 ? (
        <div className="text-center py-16 text-navy-400">No hay comisiones. Crea la primera.</div>
      ) : commissions.map(c => {
        const role    = getUserRole(c, user?.id);
        const tasks   = c.tasks ?? [];
        const members = c.members ?? [];
        const cNotes  = notes[c.id] ?? [];
        const isOpen  = expanded === c.id;
        const tab     = activeTab[c.id] ?? "tasks";

        const visibleTasks = CAN.seePrivateContent(role) ? tasks : tasks.filter((t: any) => !t.is_private);
        const done = visibleTasks.filter((t: any) => t.status === "completed").length;
        const pct  = visibleTasks.length ? Math.round((done / visibleTasks.length) * 100) : 0;

        return (
          <Card key={c.id} className="overflow-hidden">

            {/* â”€â”€ Commission header â€” div instead of button to avoid nesting â”€â”€ */}
            <div
              className="w-full text-left cursor-pointer"
              onClick={() => handleExpand(c.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && handleExpand(c.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-navy-900">{c.name}</h3>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", COLOR_MAP[c.color as Color] ?? COLOR_MAP.blue)}>
                      {done}/{visibleTasks.length} tareas
                    </span>
                    <RoleBadge role={role} />
                  </div>
                  {c.description && <p className="text-sm text-navy-500 mt-1">{c.description}</p>}
                  {visibleTasks.length > 0 && (
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex-1 h-1.5 bg-cream-100 rounded-full overflow-hidden max-w-xs">
                        <div className="h-full bg-red-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-navy-400 font-medium">{pct}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <span className="flex items-center gap-1 text-xs text-navy-400"><Users size={13} />{members.length}</span>
                  {CAN.deleteCommission(role) && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 rounded-lg text-navy-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                     
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* â”€â”€ Expanded panel â”€â”€ */}
            {isOpen && (
              <div className="mt-4 pt-4 border-t border-cream-100">

                {!role && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs text-navy-500">
                    <Eye size={13} className="text-navy-400" />
                    EstÃ¡s viendo la <strong className="text-navy-700">vista pÃºblica</strong>. El contenido exclusivo de integrantes no se muestra.
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <div className="flex bg-cream-100 rounded-xl p-1 gap-1">
                    {(["tasks", "notes"] as const).map(t => (
                      <button key={t}
                        onClick={() => setActiveTab(prev => ({ ...prev, [c.id]: t }))}
                        className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                          tab === t ? "bg-white text-navy-900 shadow-sm" : "text-navy-400 hover:text-navy-700"
                        )}>
                        {t === "tasks" ? "Tareas" : "Notas"}
                      </button>
                    ))}
                  </div>
                  {CAN.editContent(role) && (
                    <div className="ml-auto flex gap-2">
                      {tab === "tasks" && <Button size="sm" icon={<Plus size={12} />} onClick={() => setTaskModal(c.id)}>Tarea</Button>}
                      {tab === "notes" && <Button size="sm" icon={<Plus size={12} />} onClick={() => setNoteModal(c.id)}>Nota</Button>}
                    </div>
                  )}
                </div>

                {tab === "tasks" && (
                  <div className="space-y-2">
                    {visibleTasks.length === 0 && <p className="text-sm text-navy-400 text-center py-4">Sin tareas</p>}
                    {tasks.map((task: any) => {
                      if (task.is_private && !CAN.seePrivateContent(role)) return null;
                      const cfg = STATUS_CFG[task.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.pending;
                      return (
                        <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream-50 group">
                          {CAN.editContent(role) ? (
                            <button onClick={() => handleTaskStatus(task.id, task.status)} className={cn("flex-shrink-0", cfg.color)}>
                              {task.status === "completed" ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                            </button>
                          ) : (
                            <span className={cn("flex-shrink-0", cfg.color)}>
                              {task.status === "completed" ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                            </span>
                          )}
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <p className={cn("text-sm flex-1", task.status === "completed" ? "line-through text-navy-400" : "text-navy-700")}>{task.title}</p>
                            <VisibilityIcon isPrivate={task.is_private} />
                          </div>
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                          {CAN.editContent(role) && (
                            <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded text-navy-300 hover:text-red-500 transition-all">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {tab === "notes" && (
                  <div className="space-y-3">
                    {cNotes.filter((n: any) => CAN.seePrivateContent(role) || !n.is_private).length === 0 && (
                      <p className="text-sm text-navy-400 text-center py-4">Sin notas</p>
                    )}
                    {cNotes.map((note: any) => {
                      if (note.is_private && !CAN.seePrivateContent(role)) return null;
                      return (
                        <div key={note.id} className="p-3 rounded-xl bg-cream-50 border border-cream-200 group">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-navy-700 flex-1">{note.content}</p>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <VisibilityIcon isPrivate={note.is_private} />
                              {CAN.editContent(role) && (
                                <button onClick={() => handleDeleteNote(c.id, note.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded text-navy-300 hover:text-red-500 transition-all">
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-cream-100">
                  <p className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Integrantes</p>
                  <div className="flex flex-wrap gap-2">
                    {members.map((m: any) => (
                      <div key={m.id} className="flex items-center gap-1.5 bg-white border border-cream-200 rounded-full px-3 py-1">
                        <div className="w-5 h-5 rounded-full bg-navy-200 flex items-center justify-center text-[10px] font-bold text-navy-700">
                          {(m.user?.full_name ?? "?")[0]}
                        </div>
                        <span className="text-xs font-medium text-navy-700">{m.user?.full_name ?? "Usuario"}</span>
                        {m.role === "lead" && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded-full font-semibold">
                            <Crown size={8} /> LÃ­der
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* Create commission modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Nueva comision" size="md">
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 space-y-1">
            <p className="font-semibold flex items-center gap-1"><Eye size={12} /> Vista pÃºblica</p>
            <p className="text-blue-600">Nombre, descripciÃ³n, miembros, tareas y notas pÃºblicas.</p>
            <p className="font-semibold flex items-center gap-1 mt-1"><EyeOff size={12} /> Solo integrantes</p>
            <p className="text-blue-600">Tareas y notas privadas, y todas las acciones de ediciÃ³n.</p>
          </div>
          <div>
            <label className="label-base">Nombre *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-base" placeholder="Nombre de la comisiÃ³n" />
          </div>
          <div>
            <label className="label-base">DescripciÃ³n pÃºblica</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-base resize-none" rows={3} placeholder="Visible para todos" />
          </div>
          <div>
            <label className="label-base">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(col => (
                <button key={col} onClick={() => setForm({ ...form, color: col })}
                  className={cn("w-8 h-8 rounded-full border-2 transition-all",
                    col === "emerald" ? "bg-emerald-400" : col === "blue" ? "bg-blue-400" : col === "purple" ? "bg-purple-400" : col === "amber" ? "bg-amber-400" : col === "rose" ? "bg-rose-400" : "bg-indigo-400",
                    form.color === col ? "border-navy-900 scale-110" : "border-transparent"
                  )} />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setCreateModal(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving || !form.name}>{saving ? "Creando..." : "Crear comisiÃ³n"}</Button>
          </div>
        </div>
      </Modal>

      {/* Add task modal */}
      <Modal open={!!taskModal} onClose={() => setTaskModal(null)} title="Nueva tarea" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label-base">TÃ­tulo *</label>
            <input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} className="input-base" placeholder="DescripciÃ³n de la tarea" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="taskPrivate" checked={taskForm.isPrivate} onChange={e => setTaskForm({ ...taskForm, isPrivate: e.target.checked })} className="w-4 h-4 rounded" />
            <label htmlFor="taskPrivate" className="text-sm text-navy-700 flex items-center gap-1.5 cursor-pointer">
              <Lock size={13} className="text-amber-500" /> Privada â€” solo visible para integrantes
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setTaskModal(null)}>Cancelar</Button>
            <Button onClick={() => taskModal && handleAddTask(taskModal)} disabled={saving || !taskForm.title}>{saving ? "Guardando..." : "Agregar tarea"}</Button>
          </div>
        </div>
      </Modal>

      {/* Add note modal */}
      <Modal open={!!noteModal} onClose={() => setNoteModal(null)} title="Nueva nota" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label-base">Contenido *</label>
            <textarea value={noteForm.content} onChange={e => setNoteForm({ ...noteForm, content: e.target.value })} className="input-base resize-none" rows={4} placeholder="Contenido de la nota..." />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="notePrivate" checked={noteForm.isPrivate} onChange={e => setNoteForm({ ...noteForm, isPrivate: e.target.checked })} className="w-4 h-4 rounded" />
            <label htmlFor="notePrivate" className="text-sm text-navy-700 flex items-center gap-1.5 cursor-pointer">
              <Lock size={13} className="text-amber-500" /> Privada â€” solo visible para integrantes
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setNoteModal(null)}>Cancelar</Button>
            <Button onClick={() => noteModal && handleAddNote(noteModal)} disabled={saving || !noteForm.content}>{saving ? "Guardando..." : "Agregar nota"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
