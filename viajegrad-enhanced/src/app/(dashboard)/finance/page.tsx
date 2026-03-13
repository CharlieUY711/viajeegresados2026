"use client";

import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Minus, Download, Filter, Search, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard, Modal, Badge } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import type { FinanceRow } from "@/types";

const ROWS: FinanceRow[] = [
  { event: "Noche de Bingo",      income: 1800, expenses: 350,  net: 1450,  responsible: "Ana López",       date: "2025-03-15" },
  { event: "Rifa de abril",       income: 3200, expenses: 200,  net: 3000,  responsible: "Carlos Rodríguez", date: "2025-04-05" },
  { event: "Lavado de autos",     income: 650,  expenses: 80,   net: 570,   responsible: "Pedro Martínez",   date: "2025-04-27" },
  { event: "Donaciones generales",income: 2590, expenses: 0,    net: 2590,  responsible: "María García",     date: "2025-04-01" },
  { event: "Venta de remeras",    income: 480,  expenses: 310,  net: 170,   responsible: "Lucía Fernández",  date: "2025-03-28" },
  { event: "Gastos del viaje",    income: 0,    expenses: 4200, net: -4200, responsible: "Ana López",        date: "2025-04-10" },
];

const totalIncome   = ROWS.reduce((s, r) => s + r.income, 0);
const totalExpenses = ROWS.reduce((s, r) => s + r.expenses, 0);
const net           = totalIncome - totalExpenses;
const goal          = 15000;
const pct           = Math.min(Math.round((net / goal) * 100), 100);

type SortKey = keyof FinanceRow;
type SortDir = "asc" | "desc";

export default function FinancePage() {
  const { t } = useLang();
  const f = t.finance;

  const [modalOpen, setModalOpen] = useState(false);
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

  const sorted = [...ROWS]
    .filter(r => r.event.toLowerCase().includes(search.toLowerCase()) || r.responsible.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="opacity-20 ml-1">↕</span>;
    return sortDir === "asc" ? <ChevronUp size={11} className="inline ml-1" /> : <ChevronDown size={11} className="inline ml-1" />;
  };

  return (
    <div className="space-y-5 page-enter">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<TrendingUp size={20} />}
          label={f.stats.income}
          value={formatCurrency(totalIncome)}
          trend={`+8% ${f.stats.vsLastMonth}`}
          trendUp color="emerald"
        />
        <StatCard
          icon={<TrendingDown size={20} />}
          label={f.stats.expenses}
          value={formatCurrency(totalExpenses)}
          sub={f.stats.acrossEvents}
          color="rose"
        />
        <StatCard
          icon={<Minus size={20} />}
          label={f.stats.net}
          value={formatCurrency(net)}
          sub={`${pct}% ${f.stats.goalReached}`}
          color="amber"
        />
      </div>

      {/* Progress card */}
      <Card>
        <CardHeader
          title={f.progress.title}
          subtitle={`${formatCurrency(net)} ${t.common.of} ${formatCurrency(goal)}`}
          action={<span className="font-bold text-2xl text-gradient-gold">{pct}%</span>}
        />
        <div className="h-3 bg-cream-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-gradient rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-navy-400 mt-2">{formatCurrency(goal - net)} {f.progress.still}</p>

        {/* Mini bar chart */}
        <div className="mt-5 pt-5 border-t border-cream-100 grid grid-cols-6 gap-1 items-end h-16">
          {ROWS.map((row, i) => {
            const maxVal = Math.max(...ROWS.map(r => Math.max(r.income, r.expenses)));
            const incH = (row.income / maxVal) * 100;
            const expH = (row.expenses / maxVal) * 100;
            return (
              <div key={i} className="flex gap-0.5 items-end h-full" title={row.event}>
                <div className="flex-1 rounded-sm bg-emerald-200" style={{ height: `${incH}%` }} />
                <div className="flex-1 rounded-sm bg-rose-200" style={{ height: `${expH}%` }} />
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-400" /><span className="text-xs text-navy-400">Ingresos</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-rose-400" /><span className="text-xs text-navy-400">Gastos</span></div>
        </div>
      </Card>

      {/* Table */}
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
                placeholder="Buscar evento o responsable…"
                className="bg-transparent text-sm text-navy-700 placeholder:text-navy-300 w-40"
              />
            </div>
            <Button variant="outline" size="sm" icon={<Download size={13} />}>{f.export}</Button>
            <Button size="sm" icon={<Plus size={13} />} onClick={() => setModalOpen(true)}>{f.addTransaction}</Button>
          </div>
        </div>

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
                  <th
                    key={key}
                    className="table-th cursor-pointer hover:text-navy-700 select-none"
                    onClick={() => handleSort(key)}
                  >
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
                    {row.income > 0 ? (
                      <span className="text-emerald-600 font-medium">{formatCurrency(row.income)}</span>
                    ) : <span className="text-navy-300">—</span>}
                  </td>
                  <td className="table-td">
                    {row.expenses > 0 ? (
                      <span className="text-rose-500 font-medium">{formatCurrency(row.expenses)}</span>
                    ) : <span className="text-navy-300">—</span>}
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
            </tbody>
            <tfoot className="border-t-2 border-cream-200 bg-amber-50/50">
              <tr>
                <td className="table-td font-bold text-navy-800">{f.table.total}</td>
                <td className="table-td font-bold text-emerald-600">{formatCurrency(totalIncome)}</td>
                <td className="table-td font-bold text-rose-500">{formatCurrency(totalExpenses)}</td>
                <td className="table-td">
                  <span className="font-bold text-navy-900 text-base">{formatCurrency(net)}</span>
                </td>
                <td className="table-td" colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Add transaction modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={f.modal.title} size="md">
        <div className="space-y-4">
          <div>
            <label className="label-base">{f.modal.type}</label>
            <div className="flex gap-2">
              {(["income", "expense"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setForm({ ...form, type })}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all",
                    form.type === type
                      ? type === "income"
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                        : "bg-rose-500 text-white border-rose-500 shadow-sm"
                      : "bg-white text-navy-500 border-cream-200 hover:border-navy-300"
                  )}
                >
                  {type === "income" ? "💰 " + f.modal.income : "💸 " + f.modal.expense}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-base">{f.modal.amount}</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400 text-sm font-semibold">$</span>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="input-base pl-7" placeholder={f.modal.amountPlaceholder} />
            </div>
          </div>
          <div>
            <label className="label-base">{f.modal.description}</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-base" placeholder={f.modal.descPlaceholder} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">{f.modal.event}</label>
              <select value={form.event} onChange={e => setForm({ ...form, event: e.target.value })} className="input-base">
                <option value="">{f.modal.general}</option>
                <option value="bingo">Noche de Bingo</option>
                <option value="rifa">Rifa de abril</option>
                <option value="lavado">Lavado de autos</option>
              </select>
            </div>
            <div>
              <label className="label-base">{f.modal.date}</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-base" />
            </div>
          </div>
          <div>
            <label className="label-base">{f.modal.responsible}</label>
            <input value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value })} className="input-base" placeholder={f.modal.respPlaceholder} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setModalOpen(false)}>{f.modal.cancel}</Button>
            <Button>{f.modal.add}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
