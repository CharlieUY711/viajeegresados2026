"use client";

import { useState } from "react";
import { Trophy, Medal, Star, Clock, Users, Plus, Zap, Gift, Target, Crown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar, Badge } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useLang } from "@/lib/i18n";
import { formatDate, cn } from "@/lib/utils";
import type { LeaderboardEntry, Pool } from "@/types";

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user_id: "u1", full_name: "Ana López",         total_points: 420, events_participated: 8, pools_won: 3 },
  { rank: 2, user_id: "u2", full_name: "Carlos Rodríguez",  total_points: 385, events_participated: 7, pools_won: 2 },
  { rank: 3, user_id: "u3", full_name: "María García",       total_points: 310, events_participated: 6, pools_won: 1 },
  { rank: 4, user_id: "u4", full_name: "Pedro Martínez",     total_points: 275, events_participated: 5, pools_won: 2 },
  { rank: 5, user_id: "u5", full_name: "Lucía Fernández",    total_points: 260, events_participated: 6, pools_won: 1 },
  { rank: 6, user_id: "u6", full_name: "Diego Morales",      total_points: 215, events_participated: 4, pools_won: 0 },
  { rank: 7, user_id: "u7", full_name: "Valentina Cruz",     total_points: 190, events_participated: 5, pools_won: 1 },
  { rank: 8, user_id: "u8", full_name: "Isabela Ruiz",       total_points: 155, events_participated: 3, pools_won: 0 },
];

const POOLS: Pool[] = [
  {
    id: "p1",
    title: "¿Quién gana el gran premio del Bingo?",
    description: "¡Predecí qué familia se lleva el premio mayor de $500 en la Noche de Bingo!",
    type: "prediction", entry_fee: 5,
    prize_description: "Premio sorpresa para el mejor predictor",
    deadline: "2025-04-14T23:59:00Z", status: "open", created_by: "u1", created_at: "2025-04-01T00:00:00Z",
    participants: [
      { id: "pp1", pool_id: "p1", user_id: "u1", joined_at: "2025-04-02T00:00:00Z" },
      { id: "pp2", pool_id: "p1", user_id: "u2", joined_at: "2025-04-03T00:00:00Z" },
      { id: "pp3", pool_id: "p1", user_id: "u3", joined_at: "2025-04-04T00:00:00Z" },
    ],
  },
  {
    id: "p2",
    title: "Rifa: Hora de llegada a Punta Cana",
    description: "Adiviná la hora exacta de llegada al resort. ¡El más cercano gana!",
    type: "raffle", entry_fee: 10,
    prize_description: "Crédito de $100 en el resort",
    deadline: "2025-05-20T23:59:00Z", status: "open", created_by: "u2", created_at: "2025-04-05T00:00:00Z",
    participants: [{ id: "pp4", pool_id: "p2", user_id: "u4", joined_at: "2025-04-06T00:00:00Z" }],
  },
  {
    id: "p3",
    title: "Desafío: ¿Quién atrae más clientes?",
    description: "¿Quién puede traer más clientes al lavado de autos del grupo?",
    type: "challenge", entry_fee: 0,
    prize_description: "50 puntos extra + cena gratis en el viaje",
    deadline: "2025-04-27T18:00:00Z", status: "open", created_by: "u1", created_at: "2025-04-08T00:00:00Z",
    participants: [],
  },
];

const POOL_CONFIGS: Record<Pool["type"], { color: string; icon: React.ReactNode; label: string }> = {
  prediction: { color: "bg-blue-100 text-blue-700 border-blue-200",    icon: <Target size={14} />,  label: "Predicción" },
  raffle:     { color: "bg-purple-100 text-purple-700 border-purple-200", icon: <Gift size={14} />,   label: "Rifa"        },
  challenge:  { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <Zap size={14} />,    label: "Desafío"     },
};

const RANK_COLORS = [
  { bg: "from-amber-400 to-amber-500",   text: "text-amber-900", icon: <Crown size={14} />,  shadow: "shadow-amber-200"  },
  { bg: "from-slate-300 to-slate-400",   text: "text-slate-900", icon: <Medal size={14} />,  shadow: "shadow-slate-200"  },
  { bg: "from-amber-600 to-amber-700",   text: "text-amber-50",  icon: <Star size={14} />,   shadow: "shadow-amber-300"  },
];

export default function GamesPage() {
  const { t } = useLang();
  const g = t.games;
  const [activeTab, setActiveTab] = useState<"leaderboard" | "pools">("leaderboard");
  const maxPoints = LEADERBOARD[0]?.total_points ?? 1;

  return (
    <div className="space-y-5 page-enter">

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-cream-200 rounded-xl p-1 w-fit shadow-card">
        {(["leaderboard", "pools"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all",
              activeTab === tab ? "bg-navy-900 text-white shadow-sm" : "text-navy-500 hover:text-navy-800"
            )}
          >
            {tab === "leaderboard" ? "🏆 " + g.leaderboard : "🎲 " + g.pools}
          </button>
        ))}
      </div>

      {activeTab === "leaderboard" && (
        <div className="space-y-4">

          {/* Podium */}
          <div className="grid grid-cols-3 gap-3">
            {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((entry, i) => {
              const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
              const rc = RANK_COLORS[actualRank - 1];
              const heights = ["h-32", "h-44", "h-28"];
              return (
                <div
                  key={entry.user_id}
                  className={cn(
                    "relative rounded-2xl flex flex-col items-center justify-end pb-4 pt-3 px-3 overflow-hidden",
                    heights[i]
                  )}
                >
                  {/* Gradient bg */}
                  <div className={cn("absolute inset-0 bg-gradient-to-b opacity-15", rc.bg)} />
                  <div className="absolute inset-0 border border-cream-200 rounded-2xl" />

                  {/* Rank badge */}
                  <div className={cn(
                    "absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br shadow text-white",
                    rc.bg, rc.shadow
                  )}>
                    <span className="text-[10px] font-bold">{actualRank}</span>
                  </div>

                  <div className="relative flex flex-col items-center">
                    <Avatar name={entry.full_name} size="md" className="mb-2 ring-2 ring-white shadow-md" />
                    <p className="text-xs font-bold text-navy-800 leading-tight text-center">{entry.full_name.split(" ")[0]}</p>
                    <p className="text-base font-bold text-amber-600 mt-0.5">{entry.total_points} pts</p>
                    <div className="mt-1">{rc.icon}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full leaderboard */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-cream-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-navy-800">{g.rankings.title}</h3>
              <span className="text-xs text-navy-400">{LEADERBOARD.length} participantes</span>
            </div>
            <div className="divide-y divide-cream-100">
              {LEADERBOARD.map((entry) => {
                const rc = entry.rank <= 3 ? RANK_COLORS[entry.rank - 1] : null;
                const barWidth = Math.round((entry.total_points / maxPoints) * 100);
                return (
                  <div key={entry.user_id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream-50 transition-colors group">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                      rc ? `bg-gradient-to-br ${rc.bg} text-white shadow` : "bg-cream-100 text-navy-500"
                    )}>
                      {entry.rank <= 3 ? rc!.icon : entry.rank}
                    </div>
                    <Avatar name={entry.full_name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy-800">{entry.full_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-cream-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="text-xs text-navy-400 flex-shrink-0">
                          {entry.events_participated} eventos · {entry.pools_won} ganadas
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-navy-900">{entry.total_points}</p>
                      <p className="text-[10px] text-navy-400">puntos</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "pools" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button icon={<Plus size={14} />}>{g.pool.createPool}</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {POOLS.map((pool) => {
              const cfg = POOL_CONFIGS[pool.type];
              return (
                <Card key={pool.id} className="flex flex-col gap-4 hover:shadow-card-hover transition-all duration-200">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border",
                        cfg.color
                      )}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <Badge variant={pool.status === "open" ? "success" : pool.status === "closed" ? "warning" : "default"}>
                        {g.pool.statuses[pool.status]}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-navy-900 leading-snug">{pool.title}</h3>
                    <p className="text-xs text-navy-500 mt-1.5 leading-relaxed">{pool.description}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-navy-500 border-t border-cream-100 pt-3">
                    <div className="flex items-center gap-2"><Clock size={12} className="text-navy-300" /><span>{g.pool.deadline}: {formatDate(pool.deadline)}</span></div>
                    <div className="flex items-center gap-2"><Users size={12} className="text-navy-300" /><span>{pool.participants?.length ?? 0} {g.pool.participants}</span></div>
                    <div className="flex items-center gap-2"><Trophy size={12} className="text-amber-400" /><span className="text-amber-600 font-medium">{pool.prize_description}</span></div>
                  </div>

                  {pool.entry_fee > 0 && (
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                      <span className="text-xs text-amber-700">{g.pool.entryFee}</span>
                      <span className="text-sm font-bold text-amber-700">${pool.entry_fee}</span>
                    </div>
                  )}

                  {pool.participants && pool.participants.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {pool.participants.slice(0, 5).map((p, i) => (
                          <Avatar key={p.id} name={`P${i + 1}`} size="xs" className="ring-2 ring-white" />
                        ))}
                      </div>
                      {pool.participants.length > 5 && <span className="text-xs text-navy-400">+{pool.participants.length - 5}</span>}
                    </div>
                  )}

                  <Button
                    variant={pool.status === "open" ? "primary" : "outline"}
                    size="sm"
                    className="w-full mt-auto"
                    disabled={pool.status !== "open"}
                  >
                    {pool.status === "open" ? "🎯 " + g.pool.join : g.pool.closed}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
