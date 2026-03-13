"use client";

import { useState, useEffect } from "react";
import {
  Camera, Mail, User, Bell, Key, LogOut, CheckCircle2, Shield,
  Activity, Star, Eye, EyeOff, X, Cloud, HardDrive,
  Instagram, Youtube, Link2, Trash2, Plus,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Avatar, Badge } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/services/supabase";
import { cloudSyncService } from "@/services/cloudSyncService";
import { socialService, PLATFORM_META } from "@/services/socialService";
import { useRouter } from "next/navigation";
import type { CloudConnection, CloudProvider, SocialHandle, SocialPlatform } from "@/types";

const PLATFORMS: SocialPlatform[] = ["instagram", "tiktok", "facebook", "youtube"];

// â”€â”€â”€ Change Password Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm]           = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);

  const passwordsMatch = form.next === form.confirm;
  const isValid = form.current && form.next.length >= 6 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true); setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("No se encontrÃ³ el usuario");
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: form.current });
      if (signInError) throw new Error("La contraseÃ±a actual es incorrecta");
      const { error: updateError } = await supabase.auth.updateUser({ password: form.next });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); setForm({ current: "", next: "", confirm: "" }); }, 1500);
    } catch (err: any) {
      setError(err.message ?? "Error al cambiar la contraseÃ±a");
    } finally { setLoading(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-navy-900">Cambiar contraseÃ±a</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-navy-300 hover:text-navy-600 transition-colors"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-base">ContraseÃ±a actual</label>
            <div className="relative">
              <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
              <input type={showCurrent ? "text" : "password"} value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} className="input-base pl-9 pr-10" required />
              <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-600 transition-colors">
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label-base">Nueva contraseÃ±a</label>
            <div className="relative">
              <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
              <input type={showNext ? "text" : "password"} value={form.next} onChange={e => setForm({ ...form, next: e.target.value })} className="input-base pl-9 pr-10" required />
              <button type="button" onClick={() => setShowNext(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-600 transition-colors">
                {showNext ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label-base">Confirmar nueva contraseÃ±a</label>
            <div className="relative">
              <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
              <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className={cn("input-base pl-9", form.confirm && !passwordsMatch && "border-red-300")} required />
            </div>
            {form.confirm && !passwordsMatch && <p className="text-xs text-red-500 mt-1">Las contraseÃ±as no coinciden</p>}
          </div>
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">{error}</div>}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading || !isValid || success}>
              {success ? <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Guardado</span> : loading ? "Guardando..." : "Cambiar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// â”€â”€â”€ Cloud Sync Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CloudSyncSection({ userId }: { userId: string }) {
  const [connections, setConnections] = useState<CloudConnection[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    cloudSyncService.getConnections(userId).then(setConnections).finally(() => setLoading(false));
  }, [userId]);

  const isConnected = (provider: CloudProvider) => connections.some(c => c.provider === provider);
  const getConn     = (provider: CloudProvider) => connections.find(c => c.provider === provider);

  const handleConnect = (provider: CloudProvider) => {
    // In production: redirect to OAuth flow
    // For now, show a placeholder alert
    alert(`Para conectar ${provider === "google_drive" ? "Google Drive" : "OneDrive"}, configurÃ¡ las credenciales OAuth en tu proyecto.\n\nVer: cloudSyncService.getOAuthUrl()`);
  };

  const handleDisconnect = async (provider: CloudProvider) => {
    if (!confirm("Â¿Desconectar esta cuenta?")) return;
    await cloudSyncService.disconnect(userId, provider);
    setConnections(prev => prev.filter(c => c.provider !== provider));
  };

  const providers: { key: CloudProvider; label: string; icon: string; color: string }[] = [
    { key: "google_drive", label: "Google Drive", icon: "ðŸŸ¦", color: "text-blue-600" },
    { key: "onedrive",     label: "OneDrive",     icon: "ðŸŸ§", color: "text-orange-500" },
  ];

  return (
    <Card>
      <CardHeader title="Respaldo en la nube" subtitle="SincronizÃ¡ galerÃ­a y documentos con tu Drive" />
      {loading ? (
        <p className="text-sm text-navy-400">Cargando...</p>
      ) : (
        <div className="space-y-3">
          {providers.map(({ key, label, icon, color }) => {
            const connected = isConnected(key);
            const conn      = getConn(key);
            return (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-cream-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-cream-200 flex items-center justify-center text-lg shadow-sm">
                    {icon}
                  </div>
                  <div>
                    <p className={cn("text-sm font-semibold", color)}>{label}</p>
                    {connected && conn?.folder_name && (
                      <p className="text-xs text-navy-400">ðŸ“ {conn.folder_name}</p>
                    )}
                    {connected && conn?.last_sync_at && (
                      <p className="text-xs text-navy-400">
                        Ãšlt. sync: {new Date(conn.last_sync_at).toLocaleDateString("es")}
                      </p>
                    )}
                  </div>
                </div>
                {connected ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 size={12} /> Conectado
                    </span>
                    <button
                      onClick={() => handleDisconnect(key)}
                      className="p-1.5 rounded-lg text-navy-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" icon={<Cloud size={13} />} onClick={() => handleConnect(key)}>
                    Conectar
                  </Button>
                )}
              </div>
            );
          })}
          <p className="text-xs text-navy-400 pt-1">
            Una vez conectado, podrÃ¡s sincronizar desde las pÃ¡ginas de GalerÃ­a y Documentos.
          </p>
        </div>
      )}
    </Card>
  );
}

// â”€â”€â”€ Social Handles Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SocialHandlesSection({ userId }: { userId: string }) {
  const [handles, setHandles]   = useState<SocialHandle[]>([]);
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState<SocialPlatform | null>(null);
  const [handle, setHandle]     = useState("");
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    socialService.getByUser(userId).then(setHandles).finally(() => setLoading(false));
  }, [userId]);

  const handleAdd = async () => {
    if (!adding || !handle.trim()) return;
    setSaving(true);
    try {
      const saved = await socialService.upsert(userId, adding, handle);
      setHandles(prev => [...prev.filter(h => h.platform !== adding), saved]);
      setAdding(null);
      setHandle("");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (platform: SocialPlatform) => {
    await socialService.delete(userId, platform);
    setHandles(prev => prev.filter(h => h.platform !== platform));
  };

  const connected = handles.map(h => h.platform);
  const available = PLATFORMS.filter(p => !connected.includes(p));

  return (
    <Card>
      <CardHeader title="Redes sociales" subtitle="Tus perfiles visibles en la pÃ¡gina de Redes" />
      {loading ? <p className="text-sm text-navy-400">Cargando...</p> : (
        <div className="space-y-3">
          {handles.map(h => {
            const meta = PLATFORM_META[h.platform];
            return (
              <div key={h.id} className={cn("flex items-center justify-between p-2.5 rounded-xl border", meta.bg)}>
                <a href={h.profile_url} target="_blank" rel="noopener noreferrer"
                  className={cn("flex items-center gap-2 text-sm font-medium hover:underline", meta.color)}>
                  <Link2 size={13} />
                  {meta.label} Â· @{h.handle}
                </a>
                <button onClick={() => handleDelete(h.platform)} className="p-1 rounded-lg text-navy-300 hover:text-red-500 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}

          {/* Add new */}
          {adding ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder={`@tu_usuario_${adding}`}
                className="input-base flex-1"
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
              <Button size="sm" onClick={handleAdd} disabled={saving || !handle.trim()}>
                {saving ? "..." : "Guardar"}
              </Button>
              <button onClick={() => { setAdding(null); setHandle(""); }} className="p-2 rounded-lg text-navy-300 hover:text-navy-600 transition-colors">
                <X size={14} />
              </button>
            </div>
          ) : available.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {available.map(p => {
                const meta = PLATFORM_META[p];
                return (
                  <button key={p} onClick={() => setAdding(p)}
                    className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:scale-105", meta.bg, meta.color)}>
                    <Plus size={11} /> {meta.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-navy-400">Todas las redes estÃ¡n configuradas.</p>
          )}
        </div>
      )}
    </Card>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ProfilePage() {
  const { t } = useLang();
  const p = t.profile;
  const { user, updateProfile, signOut } = useAuth();
  const router = useRouter();

  const [form, setForm]     = useState({ full_name: user?.full_name ?? "", email: user?.email ?? "" });
  const [saved, setSaved]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({ new_events: true, finance_updates: true, gallery_uploads: false, game_results: true });
  const [passwordModal, setPasswordModal] = useState(false);

  const handleSave = async () => {
    setSaving(true); setSaveError(null);
    try {
      await updateProfile({ full_name: form.full_name, email: form.email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setSaveError(err.message ?? "Error al guardar");
    } finally { setSaving(false); }
  };

  const handleSignOut = async () => { await signOut(); router.push("/login"); };
  const roleLabel = user?.role === "admin" ? t.common.roles.admin : t.common.roles.member;

  return (
    <div className="max-w-2xl space-y-5 page-enter">

      {/* Hero */}
      <Card>
        <div className="h-24 rounded-xl bg-sidebar-gradient -mx-5 -mt-5 mb-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(ellipse at 70% 50%, rgba(196,30,58,0.8) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 right-4 text-4xl opacity-20">ðŸŽ“</div>
        </div>
        <div className="flex items-end gap-4 -mt-8 relative z-10 mb-4">
          <div className="relative group">
            <Avatar name={user?.full_name ?? "?"} size="lg" className="ring-4 ring-white shadow-lg w-16 h-16 text-xl" />
            <button className="absolute inset-0 flex items-center justify-center bg-navy-950/0 group-hover:bg-navy-950/40 rounded-full transition-all duration-200">
              <Camera size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-navy-900">{user?.full_name ?? "Usuario"}</h2>
              <Badge variant={user?.role === "admin" ? "warning" : "default"}>{roleLabel}</Badge>
            </div>
            <p className="text-sm text-navy-400">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-cream-100">
          {[
            { value: user?.points ?? 0, label: p.points, icon: <Star size={13} className="text-red-400" /> },
            { value: `#${user?.rank ?? "â€”"}`, label: "Ranking", icon: <Activity size={13} className="text-navy-400" /> },
            { value: user?.events_joined ?? 0, label: p.events, icon: "ðŸ“…" },
            { value: user?.photos_uploaded ?? 0, label: p.photos, icon: "ðŸ“¸" },
          ].map(({ value, label, icon }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-1">{typeof icon === "string" ? <span className="text-sm">{icon}</span> : icon}</div>
              <p className="text-base font-bold text-navy-900">{value}</p>
              <p className="text-[11px] text-navy-400">{label}</p>
            </div>
          ))}
        </div>
        {(user?.commissions?.length ?? 0) > 0 && (
          <div className="mt-4 pt-4 border-t border-cream-100 flex flex-wrap items-center gap-2">
            <p className="text-xs text-navy-400 mr-1">{p.commissions}</p>
            {user?.commissions?.map((c: string) => <Badge key={c} variant="info">{c}</Badge>)}
          </div>
        )}
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
          {saveError && <p className="text-xs text-red-500">{saveError}</p>}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} variant={saved ? "secondary" : "primary"}>
              {saved ? <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> {p.saved}</span> : saving ? "Guardando..." : p.save}
            </Button>
          </div>
        </div>
      </Card>

      {/* Social handles */}
      {user?.id && <SocialHandlesSection userId={user.id} />}

      {/* Cloud sync */}
      {user?.id && <CloudSyncSection userId={user.id} />}

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
                className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200", value ? "bg-red-500" : "bg-navy-200")}
              >
                <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200", value ? "translate-x-4" : "translate-x-0.5")} />
              </button>
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
              <p className="text-xs text-emerald-600">Tu correo electrÃ³nico estÃ¡ confirmado.</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" icon={<Key size={15} />} onClick={() => setPasswordModal(true)}>
            {p.changePassword}
          </Button>
          <div className="pt-2 border-t border-cream-100">
            <p className="text-xs text-navy-400 mb-2">{p.dangerZone}</p>
            <Button variant="danger" size="sm" icon={<LogOut size={13} />} onClick={handleSignOut}>{p.signOut}</Button>
          </div>
        </div>
      </Card>

      <ChangePasswordModal open={passwordModal} onClose={() => setPasswordModal(false)} />
    </div>
  );
}
