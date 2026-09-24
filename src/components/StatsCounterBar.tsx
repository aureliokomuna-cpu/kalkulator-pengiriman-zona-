import { CounterStats } from '../types/zone';
import { formatRupiah } from '../utils/formatters';
import { Activity, Receipt, TrendingUp, Sparkles } from 'lucide-react';

interface StatsCounterBarProps {
  stats: CounterStats;
}

export function StatsCounterBar({ stats }: StatsCounterBarProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Counter Highlight - Very Prominent & Direct */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Counter Penggunaan
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
                {stats.todayCalculations}x
              </span>
              <span className="text-xs text-slate-300 font-medium">Hari Ini</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-xs text-slate-400">
                Total Akumulasi: <strong className="font-mono text-slate-200">{stats.totalCalculations}x</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Quick summary stats in a clean row */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0 w-full sm:w-auto">
          <div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Receipt className="h-3 w-3 text-sky-400" />
              <span>Selisih Terkumpul Hari Ini:</span>
            </div>
            <div className="font-mono font-bold text-sky-400 text-sm tabular-nums">
              {formatRupiah(stats.todaySelisihCollected)}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span>Total Omset Trx Hari Ini:</span>
            </div>
            <div className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
              {formatRupiah(stats.todayTransactionVolume)}
            </div>
          </div>

          {stats.todaySavingsGiven > 0 && (
            <div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Diskon Promo Diberikan:</span>
              </div>
              <div className="font-mono font-bold text-amber-400 text-sm tabular-nums">
                {formatRupiah(stats.todaySavingsGiven)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
