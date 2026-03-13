"use client";

import { DollarSign, CalendarDays, Users, TrendingUp, Clock, ArrowRight, Sparkles, Target } from "lucide-react";
import { StatCard } from "@/components/ui";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui";
import { formatCurrency, formatDate, formatRelativeDate } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FUNDRAISING_GOAL = 15000;
const RAISED = 8240;

const UPCOMING = [
  { id: "1", title: "Noche de Bingo",       date: "2025-04-15", category: "fundraising", location: "Salón del colegio" },
  { id: "2", title: "Reunión de padres",    date: "2025-04-20", category: "meeting",     location: "Biblioteca"        },
  { id: "3", title: "Lavado de autos",      date: "2025-04-27", category: "fundraising", location: "Estacionamiento"   },
  { id: "4", title: "¡Viaje de egresados!", date: "2025-05-23", category: "trip",        location: "Punta Cana"        },
];

const ACTIVITY = [
  { id: "1", user: "María García",     action: "subió 8 fotos",                   when: "2025-04-10T10:32:00Z", type: "gallery"  },
  { id: "2", user: "Carlos Rodríguez", action: "agregó $500 de ingreso",          when: "2025-04-10T09:15:00Z", type: "finance"  },
  { id: "3", user: "Ana López",        action: "creó el evento Noche de Bingo",   when: "2025-04-09T17:00:00Z", type: "event"    },
  { id: "4", user: "Pedro Martínez",   action: "se unió a Lavado de autos",       when: "2025-04-09T14:20:00Z", type: "event"    },
  { id: "5", user: "Lucía Fernández",  action: "subió la autorización firmada",   when: "2025-04-08T11:00:00Z", type: "doc"      },
];

const PHOTOS = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80",
  "https://images.unsplash.com/photo-1627556704302-624286467c65?w=400&q=80",
  "https://images.unsplash.com/photo-1612213995754-58b02de09823?w=400&q=80",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80",
  "https://images.unsplash.com/photo-1595654383550-e84f14b4d97f?w=400&q=80",
];

const FUNDRAISING_BREAKDOWN = [
  { label: "Noche de Bingo", amount: 1800, pct: 22, color: "bg-amber-400" },
  { label: "Rifa",           amount: 3200, pct: 39, color: "bg-emerald-400" },
  { label: "Lavado autos",   amount: 650,  pct: 8,  color: "bg-blue-400" },
  { label: "Donaciones",     amount: 2590, pct: 31, color: "bg-purple-400" },
];

const CATEGORY_COLORS: Record<string, "success" | "warning" | "info" | "purple"> = {
  fundraising: "success", meeting: "info", trip: "purple", social: "warning",
};

const ACTIVITY_COLORS: Record<string, string> = {
  gallery: "bg-purple-100 text-purple-600",
  finance: "bg-emerald-100 text-emerald-600",
  event:   "bg-blue-100 text-blue-600",
  doc:     "bg-amber-100 text-amber-600",
};

const ACTIVITY_ICONS: Record<string, string> = {
  gallery: "📸", finance: "💰", event: "📅", doc: "📄",
};

const progressPct = Math.round((RAISED / FUNDRAISING_GOAL) * 100);

export default function DashboardPage() {
  const { t } = useLang();
  const d = t.dashboard;

  return (
    <div className="space-y-6 page-enter">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-sidebar-gradient p-6 border border-white/10">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, rgba(245,158,11,0.6) 0%, transparent 60%)" }}
        />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">ViajeGrad 2025</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">¡Bienvenido/a de nuevo! 🎓</h2>
            <p className="text-white/50 text-sm mt-1">El viaje de egresados está a <span className="text-amber-400 font-bold">42 días</span> de distancia.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20 text-center">
            <p className="text-amber-300 text-xs font-medium mb-0.5">Meta de recaudación</p>
            <p className="text-white text-2xl font-bold">{progressPct}%</p>
            <p className="text-white/50 text-xs">completado</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign size={20} />}
          label={d.stats.totalRaised}
          value={formatCurrency(RAISED)}
          sub={`${d.stats.goal}: ${formatCurrency(FUNDRAISING_GOAL)}`}
          trend="+12% este mes" trendUp color="amber"
        />
        <StatCard
          icon={<Target size={20} />}
          label={d.stats.progress}
          value={`${progressPct}%`}
          sub={`${formatCurrency(FUNDRAISING_GOAL - RAISED)} ${d.stats.remaining}`}
          color="emerald"
        />
        <StatCard
          icon={<CalendarDays size={20} />}
          label={d.stats.events}
          value="12"
          sub={`4 ${d.stats.upcomingEvents}`}
          color="blue"
        />
        <StatCard
          icon={<Users size={20} />}
          label={d.stats.families}
          value="48"
          sub={d.stats.confirmed}
          color="rose"
        />
      </div>

      {/* Fundraising progress */}
      <Card>
        <CardHeader
          title={d.fundraising.title}
          subtitle={d.fundraising.subtitle}
          action={
            <Link href="/finance" className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-600 font-medium transition-colors">
              Ver finanzas <ArrowRight size={12} />
            </Link>
          }
        />
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-navy-800">{formatCurrency(RAISED)} recaudados</span>
            <span className="text-amber-500">{progressPct}%</span>
          </div>
          <div className="relative h-3 bg-cream-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gold-gradient transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-navy-400">
            <span>$0</span>
            <span>{d.stats.goal}: {formatCurrency(FUNDRAISING_GOAL)}</span>
          </div>
        </div>

        {/* Breakdown mini-chart */}
        <div className="mt-5 pt-5 border-t border-cream-100">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-3">Desglose por fuente</p>
          <div className="space-y-2.5">
            {FUNDRAISING_BREAKDOWN.map(({ label, amount, pct, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs text-navy-500 w-28 flex-shrink-0">{label}</span>
                <div className="flex-1 h-1.5 bg-cream-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-navy-700 w-14 text-right">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Upcoming events */}
        <Card>
          <CardHeader
            title={d.upcoming.title}
            subtitle={d.upcoming.subtitle}
            action={
              <Link href="/events" className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-600 font-medium transition-colors">
                Ver todos <ArrowRight size={12} />
              </Link>
            }
          />
          <ul className="space-y-1">
            {UPCOMING.map((ev) => (
              <li key={ev.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-cream-100 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center flex-shrink-0 group-hover:border-amber-200 transition-colors">
                  <span className="text-[9px] font-bold text-amber-600 leading-none uppercase">{formatDate(ev.date, "MMM")}</span>
                  <span className="text-sm font-bold text-amber-700 leading-none">{formatDate(ev.date, "d")}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy-800 leading-none">{ev.title}</p>
                  <p className="text-xs text-navy-400 mt-1">{ev.location}</p>
                </div>
                <Badge variant={CATEGORY_COLORS[ev.category] ?? "default"}>
                  {t.events.categories[ev.category as keyof typeof t.events.categories] ?? ev.category}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        {/* Activity feed */}
        <Card>
          <CardHeader title={d.activity.title} subtitle={d.activity.subtitle} />
          <ul className="space-y-3">
            {ACTIVITY.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm mt-0.5 ${ACTIVITY_COLORS[a.type]}`}>
                  {ACTIVITY_ICONS[a.type]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-navy-700 leading-snug">
                    <span className="font-semibold text-navy-900">{a.user}</span> {a.action}
                  </p>
                  <p className="text-[11px] text-navy-400 mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> {formatRelativeDate(a.when)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recent photos */}
      <Card>
        <CardHeader
          title={d.photos.title}
          subtitle={d.photos.subtitle}
          action={
            <Link href="/gallery" className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-600 font-medium transition-colors">
              {d.photos.viewAll} <ArrowRight size={12} />
            </Link>
          }
        />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PHOTOS.map((src, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl overflow-hidden bg-cream-200 hover:scale-105 transition-transform duration-200 cursor-pointer shadow-sm"
            >
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
