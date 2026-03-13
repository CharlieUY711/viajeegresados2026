"use client";

import { useState } from "react";
import { Camera, Mail, User, Bell, Key, LogOut, CheckCircle2, Shield, Activity, Star } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Avatar, Badge } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const MOCK_USER = {
  id: "u1",
  full_name: "María García",
  email: "maria.garcia@email.com",
  role: "admin" as const,
  events_joined: 8,
  photos_uploaded: 14,
  commissions: ["Recaudación", "Documentación"],
  points: 310,
  rank: 3,
  joined_at: "2024-12-01",
};

const ACTIVITY_LOG = [
  { action: "Subiste 3 fotos a la galería",         when: "Hace 2 horas",  icon: "📸" },
  { action: "Completaste tarea de documentación",    when: "Ayer",          icon: "✅" },
  { action: "Te uniste a la Rifa de abril",          when: "Hace 3 días",   icon: "🎲" },
  { action: "Registraste ingreso de $500",           when: "Hace 5 días",   icon: "💰" },
];

export default function ProfilePage() {
  const { t } = useLang();
  const p = t.profile;

  const [form, setForm] = useState({ full_name: MOCK_USER.full_name, email: MOCK_USER.email });
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    new_events:       true,
    finance_updates:  true,
    gallery_uploads:  false,
    game_results:     true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const roleLabel = MOCK_USER.role === "admin" ? t.common.roles.admin : t.common.roles.member;

  return (
    <div className="max-w-2xl space-y-5 page-enter">

      {/* Profile hero */}
      <Card>
        {/* Banner */}
        <div className="h-24 rounded-xl bg-sidebar-gradient -mx-5 -mt-5 mb-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(ellipse at 70% 50%, rgba(245,158,11,0.8) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 right-4 text-4xl opacity-20">🎓</div>
        </div>

        <div className="flex items-end gap-4 -mt-8 relative z-10 mb-4">
          <div className="relative group">
            <Avatar name={MOCK_USER.full_name} size="lg" className="ring-4 ring-white shadow-lg w-16 h-16 text-xl" />
            <button className="absolute inset-0 flex items-center justify-center bg-navy-950/0 group-hover:bg-navy-950/40 rounded-full transition-all duration-200">
              <Camera size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-navy-900">{MOCK_USER.full_name}</h2>
              <Badge variant={MOCK_USER.role === "admin" ? "warning" : "default"}>{roleLabel}</Badge>
            </div>
            <p className="text-sm text-navy-400">{MOCK_USER.email}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-cream-100">
          {[
            { value: MOCK_USER.points, label: p.points, icon: <Star size={13} className="text-amber-400" /> },
            { value: `#${MOCK_USER.rank}`,   label: "Ranking",   icon: <Activity size={13} className="text-blue-400" /> },
            { value: MOCK_USER.events_joined, label: p.events,   icon: "📅" },
            { value: MOCK_USER.photos_uploaded, label: p.photos, icon: "📸" },
          ].map(({ value, label, icon }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-1">{typeof icon === "string" ? <span className="text-sm">{icon}</span> : icon}</div>
              <p className="text-base font-bold text-navy-900">{value}</p>
              <p className="text-[11px] text-navy-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Commissions */}
        <div className="mt-4 pt-4 border-t border-cream-100 flex flex-wrap items-center gap-2">
          <p className="text-xs text-navy-400 mr-1">{p.commissions}</p>
          {MOCK_USER.commissions.map(c => <Badge key={c} variant="info">{c}</Badge>)}
        </div>
      </Card>

      {/* Edit profile */}
      <Card>
        <CardHeader title={p.sections.personal.title} subtitle={p.sections.personal.subtitle} />
        <div className="space-y-4">
          <div>
            <label className="label-base">{p.fields.fullName}</label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
              <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="input-base pl-9" />
            </div>
          </div>
          <div>
            <label className="label-base">{p.fields.email}</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-base pl-9" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} variant={saved ? "secondary" : "primary"}>
              {saved ? (
                <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> {p.saved}</span>
              ) : p.save}
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader title={p.sections.notifications.title} subtitle={p.sections.notifications.subtitle} />
        <div className="space-y-1">
          {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-cream-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-navy-50 flex items-center justify-center">
                  <Bell size={14} className="text-navy-400" />
                </div>
                <span className="text-sm text-navy-700">{p.notifications[key]}</span>
              </div>
              <button
                onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200",
                  value ? "bg-amber-500" : "bg-navy-200"
                )}
              >
                <span className={cn(
                  "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200",
                  value ? "translate-x-4" : "translate-x-0.5"
                )} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent activity */}
      <Card>
        <CardHeader title="Actividad reciente" subtitle="Tus últimas acciones en ViajeGrad" />
        <div className="space-y-3">
          {ACTIVITY_LOG.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cream-100 flex items-center justify-center text-sm flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-navy-700">{item.action}</p>
                <p className="text-xs text-navy-400 mt-0.5">{item.when}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader title={p.sections.security.title} subtitle={p.sections.security.subtitle} />
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <Shield size={16} className="text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-700">Cuenta verificada</p>
              <p className="text-xs text-emerald-600">Tu correo electrónico está confirmado.</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" icon={<Key size={15} />}>{p.changePassword}</Button>
          <div className="pt-2 border-t border-cream-100">
            <p className="text-xs text-navy-400 mb-2">{p.dangerZone}</p>
            <Button variant="danger" size="sm" icon={<LogOut size={13} />}>{p.signOut}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
