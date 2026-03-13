"use client";

import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Minus, Download, Search, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard, Modal } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { useFinance } from "@/hooks/useData";
import { useAuth } from "@/hooks/useAuth";
import type { FinanceRow } from "@/types";

type SortKey = keyof FinanceRow;
type SortDir = "asc" | "desc";

export default function FinancePage() {
  const { t } = useLang();
  const f = t.finance;
  const { user } = useAuth();
  const { rows, summary, loading, addTransaction } = useFinance();

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");
  const [sortKey, setSortKey]     = useState<SortKey>("date");
  const [sortDir, setSortDir]     = useState<SortDir>("desc");
  const [form, setForm]           = useState({
    type: "income", amount: "", description: "", event: "", responsible: "", date: "",
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...rows]
    .filter(r =>
      r.event.toLowerCase().includes(search.toLowerCase()) ||
      r.responsible.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="opacity-20 ml-1">updown</span>;
    return sortDir === "asc"
      ? <ChevronUp size={11} className="inline ml-1" />
      : <ChevronDown size={11} className="inline ml-1" />;
  };

  const handleSave = async () => {
    if (!form.amount || !form.description || !user) return;
    setSaving(true);
    try {
      await addTransaction({
        type: form.type as "income" | "expense",
        amount: parseFloat(form.amount),
        description: form.description,
        responsible_id: user.id,
        date: form.date || new Date().toISOString().slice(0, 10),
        event_id: undefined,
      });
      setModalOpen(false);
      setForm({ type: "income", amount: "", description: "", event: "", responsible: "", date: "" });
    } catch (e) {
      console.error(e);
      alert("Error al guardar la transaccion");
    } finally {
      setSaving(false);
    }
  };

  const pct  = summary?.progress_percentage ?? 0;
  const goal = summary?.goal ?? 15000;

  return (
    <div className="space-y-5 page-enter">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<TrendingUp size={20} />}
          label={f.stats.income}
          value={formatCurrency(summary?.total_income ?? 0)}
          color="emerald"
        />
        <StatCard
          icon={<TrendingDown size={20} />}
          label={f.stats.expenses}
          value={formatCurrency(summary?.total_expenses ?? 0)}
          color="rose"
        />
        <StatCard
          icon={<Minus size={20} />}
          label={f.stats.net}
          value={formatCurrency(summary?.net ?? 0)}
          sub={`${pct}% de la meta`}
          color="amber"
        />
      </div>

      <Card>
        <CardHeader
          title={f.progress.title}
          subtitle={`${formatCurrency(summary?.net ?? 0)} de ${formatCurrency(goal)}`}
          action={<span className="font-bold text-2xl text-amber-500">{pct}%</span>}
        />
        <div className="h-3 bg-cream-100 rounded-full overflow-hidden">
          <div className="h-full bg-gold-gradient rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-navy-400 mt-2">{formatCurrency(goal - (summary?.net ?? 0))} restantes para la meta</p>
      </Card>

      <Card padding="none">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
          <div>
            <h3 className="text-base font-semibold text-navy-900">{f.table.title}</h3>
            <p className="text-xs text-navy-400 mt-0.5">{f.table.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-cream-50 border border-cream-200 rounded-xl px-3 py-2">
              <Search size={13} className="text-navy-300" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="bg-transparent text-sm text-navy-700 placeholder:text-navy-300 w-32"
              />
            </div>
            <Button size="sm" icon={<Plus size={13} />} onClick={() => setModalOpen(true)}>{f.addTransaction}</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-navy-400">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-y border-cream-100 bg-cream-50">
                <tr>
                  {([
                    ["event", f.table.event],
                    ["income", f.table.income],
                    ["expenses", f.table.expenses],
                    ["net", f.table.net],
                    ["responsible", f.table.responsible],
                    ["date", f.table.date],
                  ] as [SortKey, string][]).map(([key, label]) => (
                    <th key={key} className="table-th cursor-pointer hover:text-navy-700 select-none" onClick={() => handleSort(key)}>
                      {label}<SortIcon col={key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-td font-semibold text-navy-800">{row.event}</td>
                    <td className="table-td">
                      {row.income > 0
                        ? <span className="text-emerald-600 font-medium">{formatCurrency(row.income)}</span>
                        : <span className="text-navy-300">-</span>}
                    </td>
                    <td className="table-td">
                      {row.expenses > 0
                        ? <span className="text-rose-500 font-medium">{formatCurrency(row.expenses)}</span>
                        : <span className="text-navy-300">-</span>}
                    </td>
                    <td className="table-td">
                      <span className={cn(
                        "inline-flex items-center gap-1 font-bold text-sm px-2 py-0.5 rounded-lg",
                        row.net >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                      )}>
                        {row.net >= 0 ? "+" : ""}{formatCurrency(row.net)}
                      </span>
                    </td>
                    <td className="table-td text-navy-500">{row.responsible}</td>
                    <td className="table-td text-navy-400">{formatDate(row.date)}</td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-navy-400">Sin transacciones</td></tr>
                )}
              </tbody>
              {sorted.length > 0 && (
                <tfoot className="border-t-2 border-cream-200 bg-amber-50/50">
                  <tr>
                    <td className="table-td font-bold text-navy-800">Total</td>
                    <td className="table-td font-bold text-emerald-600">{formatCurrency(summary?.total_income ?? 0)}</td>
                    <td className="table-td font-bold text-rose-500">{formatCurrency(summary?.total_expenses ?? 0)}</td>
                    <td className="table-td font-bold text-navy-900 text-base">{formatCurrency(summary?.net ?? 0)}</td>
                    <td className="table-td" colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva transaccion" size="md">
        <div className="space-y-4">
          <div>
            <label className="label-base">Tipo</label>
            <div className="flex gap-2">
              {(["income", "expense"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setForm({ ...form, type })}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all",
                    form.type === type
                      ? type === "income"
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-rose-500 text-white border-rose-500"
                      : "bg-white text-navy-500 border-cream-200 hover:border-navy-300"
                  )}
                >
                  {type === "income" ? "Ingreso" : "Gasto"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-base">Monto *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400 text-sm font-semibold">$</span>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="input-base pl-7" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="label-base">Descripcion *</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-base" placeholder="Descripcion de la transaccion" />
          </div>
          <div>
            <label className="label-base">Fecha</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-base" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.amount || !form.description}>
              {saving ? "Guardando..." : "Agregar"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}