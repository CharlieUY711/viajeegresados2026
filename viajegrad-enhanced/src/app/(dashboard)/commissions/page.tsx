"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Users, Plus, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar, Badge } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Task   { id: string; title: string; status: "pending" | "in_progress" | "completed"; assignee?: string; }
interface Member { id: string; name: string; role: "lead" | "member"; }
interface CommissionCard { id: string; name: string; description: string; color: string; emoji: string; members: Member[]; tasks: Task[]; }

const COMMISSIONS: CommissionCard[] = [
  {
    id: "1", name: "Recaudación", emoji: "💰",
    description: "Organizar todas las actividades de recaudación para alcanzar la meta de $15.000.",
    color: "emerald",
    members: [
      { id: "m1", name: "Ana López",       role: "lead"   },
      { id: "m2", name: "Carlos R.",        role: "member" },
      { id: "m3", name: "Sofía Torres",     role: "member" },
    ],
    tasks: [
      { id: "t1", title: "Planificar logística de la Noche de Bingo",   status: "completed",   assignee: "Ana López"  },
      { id: "t2", title: "Confirmar premios de la rifa",                 status: "completed",   assignee: "Carlos R."  },
      { id: "t3", title: "Organizar insumos del lavado de autos",        status: "in_progress", assignee: "Sofía Torres" },
      { id: "t4", title: "Investigar nuevas ideas de recaudación mayo",  status: "pending"                              },
    ],
  },
  {
    id: "2", name: "Logística y Viaje", emoji: "✈️",
    description: "Gestionar el transporte, el alojamiento y el itinerario del viaje.",
    color: "blue",
    members: [
      { id: "m4", name: "Pedro Martínez",  role: "lead"   },
      { id: "m5", name: "Lucía Fernández", role: "member" },
    ],
    tasks: [
      { id: "t5", title: "Confirmar reserva del hotel",       status: "completed",   assignee: "Pedro M."   },
      { id: "t6", title: "Contratar ómnibus chárter",         status: "in_progress", assignee: "Pedro M."   },
      { id: "t7", title: "Crear itinerario diario detallado", status: "pending",     assignee: "Lucía F."   },
      { id: "t8", title: "Recopilar pasaportes / cédulas",    status: "pending"                              },
    ],
  },
  {
    id: "3", name: "Documentación", emoji: "📋",
    description: "Gestionar autorizaciones, fichas médicas y documentos administrativos.",
    color: "amber",
    members: [
      { id: "m6", name: "María García", role: "lead"   },
      { id: "m7", name: "Juan Pérez",   role: "member" },
    ],
    tasks: [
      { id: "t9",  title: "Redactar modelo de autorización",             status: "completed",   assignee: "María G."  },
      { id: "t10", title: "Recopilar 48 autorizaciones firmadas",        status: "in_progress", assignee: "María G."  },
      { id: "t11", title: "Consolidar fichas médicas de cada alumno",    status: "pending",     assignee: "Juan P."   },
    ],
  },
  {
    id: "4", name: "Entretenimiento", emoji: "🎮",
    description: "Planificar actividades, juegos y entretenimiento para el viaje.",
    color: "purple",
    members: [
      { id: "m8",  name: "Valentina Cruz", role: "lead"   },
      { id: "m9",  name: "Diego Morales",  role: "member" },
      { id: "m10", name: "Isabela Ruiz",   role: "member" },
    ],
    tasks: [
      { id: "t12", title: "Crear cronograma de juegos para el viaje",   status: "in_progress", assignee: "Valentina C." },
      { id: "t13", title: "Comprar premios para ganadores de rifas",     status: "pending"                                },
      { id: "t14", title: "Organizar torneo de vóley playa",             status: "pending",     assignee: "Diego M."     },
    ],
  },
];

const COLOR_MAP: Record<string, { header: string; border: string; tag: string; bar: string; accent: string }> = {
  emerald: { header: "bg-emerald-50", border: "border-emerald-200", tag: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500", accent: "text-emerald-600" },
  blue:    { header: "bg-blue-50",    border: "border-blue-200",    tag: "bg-blue-100 text-blue-700",       bar: "bg-blue-500",    accent: "text-blue-600"    },
  amber:   { header: "bg-amber-50",   border: "border-amber-200",   tag: "bg-amber-100 text-amber-700",     bar: "bg-amber-500",   accent: "text-amber-600"   },
  purple:  { header: "bg-purple-50",  border: "border-purple-200",  tag: "bg-purple-100 text-purple-700",   bar: "bg-purple-500",  accent: "text-purple-600"  },
};

function TaskStatus({ status }: { status: Task["status"] }) {
  if (status === "completed")
    return <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />;
  if (status === "in_progress")
    return (
      <div className="w-4 h-4 flex-shrink-0 rounded-full border-2 border-amber-400 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      </div>
    );
  return <Circle size={16} className="text-navy-200 flex-shrink-0" />;
}

function CommissionCardComponent({ c }: { c: CommissionCard }) {
  const { t } = useLang();
  const co = t.commissions;
  const [expanded, setExpanded] = useState(false);
  const colors    = COLOR_MAP[c.color];
  const completed = c.tasks.filter(t => t.status === "completed").length;
  const inProgress = c.tasks.filter(t => t.status === "in_progress").length;
  const pct       = Math.round((completed / c.tasks.length) * 100);

  return (
    <Card className="border border-cream-200 overflow-hidden !p-0 hover:shadow-card-hover transition-all duration-200">
      {/* Header */}
      <div className={cn("px-5 pt-5 pb-4", colors.header, "border-b", colors.border)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{c.emoji}</span>
            <div>
              <h3 className="text-base font-bold text-navy-900">{c.name}</h3>
              <p className="text-xs text-navy-500 mt-0.5 leading-relaxed max-w-xs">{c.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xl font-bold text-navy-800">{pct}%</p>
              <p className="text-[10px] text-navy-400">{co.complete}</p>
            </div>
            <button className="p-1.5 rounded-lg text-navy-300 hover:bg-white/60 transition-colors">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3 h-1.5 bg-white/60 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-500", colors.bar)} style={{ width: `${pct}%` }} />
        </div>

        {/* Mini task summary */}
        <div className="flex items-center gap-3 mt-2.5 text-[11px] text-navy-400">
          <span className="text-emerald-600 font-medium">✓ {completed} completadas</span>
          {inProgress > 0 && <span className="text-amber-600 font-medium">⬤ {inProgress} en progreso</span>}
          <span>{c.tasks.length - completed - inProgress} pendientes</span>
        </div>
      </div>

      {/* Members */}
      <div className="px-5 py-3 border-b border-cream-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 flex-wrap">
          {c.members.map(m => (
            <div key={m.id} className="flex items-center gap-1.5">
              <Avatar name={m.name} size="xs" />
              <span className="text-xs text-navy-600">{m.name.split(" ")[0]}</span>
              {m.role === "lead" && (
                <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", colors.tag)}>
                  {co.lead}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-navy-400">
          <Users size={11} /> {c.members.length}
        </div>
      </div>

      {/* Tasks toggle */}
      <div>
        <button
          onClick={() => setExpanded(p => !p)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs text-navy-500 hover:bg-cream-50 transition-colors"
        >
          <span className="font-semibold">{co.tasks} ({c.tasks.length})</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="px-5 pb-4 space-y-2.5 border-t border-cream-100 pt-3">
            {c.tasks.map(task => (
              <div key={task.id} className="flex items-start gap-2.5 group">
                <div className="mt-0.5"><TaskStatus status={task.status} /></div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm leading-snug",
                    task.status === "completed" ? "line-through text-navy-400" : "text-navy-700"
                  )}>
                    {task.title}
                  </p>
                  {task.assignee && (
                    <p className="text-xs text-navy-400 mt-0.5">{task.assignee}</p>
                  )}
                </div>
                <Badge
                  variant={task.status === "completed" ? "success" : task.status === "in_progress" ? "warning" : "default"}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {co.taskStatuses[task.status]}
                </Badge>
              </div>
            ))}
            <button className="flex items-center gap-1.5 text-xs text-navy-400 hover:text-navy-700 transition-colors mt-1 pt-1">
              <Plus size={13} /> {co.addTask}
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function CommissionsPage() {
  const { t } = useLang();
  const co = t.commissions;

  const totalMembers = COMMISSIONS.reduce((s, c) => s + c.members.length, 0);
  const totalTasks   = COMMISSIONS.reduce((s, c) => s + c.tasks.length, 0);
  const doneTotal    = COMMISSIONS.reduce((s, c) => s + c.tasks.filter(t => t.status === "completed").length, 0);
  const overallPct   = Math.round((doneTotal / totalTasks) * 100);

  return (
    <div className="space-y-5 page-enter">

      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-2xl border border-cream-200 shadow-card">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1.5">
            <span>Progreso general del proyecto</span>
            <span className="font-bold text-navy-800">{overallPct}%</span>
          </div>
          <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
            <div className="h-full bg-gold-gradient rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-6 text-center">
          {[
            { value: COMMISSIONS.length, label: "Comisiones" },
            { value: totalMembers,       label: "Miembros" },
            { value: `${doneTotal}/${totalTasks}`, label: "Tareas" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-lg font-bold text-navy-900">{value}</p>
              <p className="text-xs text-navy-400">{label}</p>
            </div>
          ))}
        </div>
        <Button icon={<Plus size={14} />}>{co.newCommission}</Button>
      </div>

      {/* Commission cards grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {COMMISSIONS.map(c => <CommissionCardComponent key={c.id} c={c} />)}
      </div>
    </div>
  );
}
