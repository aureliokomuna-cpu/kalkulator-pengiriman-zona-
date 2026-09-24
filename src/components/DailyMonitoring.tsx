import { DailySummary, HistoryItem } from '../types/zone';
import { formatRupiah, exportHistoryToCSV } from '../utils/formatters';
import { Calendar, Download, TrendingUp, Sparkles, Package, RotateCcw, AlertTriangle } from 'lucide-react';

interface DailyMonitoringProps {
  dailySummaries: DailySummary[];
  history: HistoryItem[];
  onResetSample: () => void;
  onClearHistory: () => void;
}

export function DailyMonitoring({
  dailySummaries,
  history,
  onResetSample,
  onClearHistory,
}: DailyMonitoringProps) {
  // Compute zone distributions across history
  const zoneCounts: Record<string, number> = {};
  let totalPromoSabarUsed = 0;

  history.forEach(item => {
    zoneCounts[item.zoneName] = (zoneCounts[item.zoneName] || 0) + 1;
    if (item.isPromoSabar) totalPromoSabarUsed++;
  });

  const maxDailyVolume = Math.max(...dailySummaries.map(d => d.totalTransaksi), 1);

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Monitoring & Rekapitulasi Harian
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pantau akumulasi perhitungan transaksi, biaya selisih zona, dan pemakaian promo setiap harinya.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportHistoryToCSV(history)}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white disabled:opacity-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onResetSample}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Muat data contoh pengujian"
          >
            <RotateCcw className="h-3.5 w-3.5 text-sky-400" />
            <span>Sample Data</span>
          </button>
        </div>
      </div>

      {/* Visual Bar Timeline per Day */}
      {dailySummaries.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400" />
              Volume Transaksi Harian
            </h3>
            <span className="text-xs text-slate-400">
              {dailySummaries.length} Hari Terdata
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {dailySummaries.map((day) => {
              const percentage = Math.round((day.totalTransaksi / maxDailyVolume) * 100);

              return (
                <div key={day.dateKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      {day.dateLabel}
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400">
                        {day.count} trx
                      </span>
                      <span className="font-bold text-emerald-400 tabular-nums">
                        {formatRupiah(day.totalTransaksi)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="h-3 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800/80 flex">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>
                      Selisih Zona: <span className="font-mono text-sky-400">{formatRupiah(day.totalBiayaSelisih)}</span>
                    </span>
                    {day.totalHematPromo > 0 && (
                      <span className="text-amber-300">
                        Hemat Promo: <span className="font-mono">{formatRupiah(day.totalHematPromo)}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Aggregated Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Tabel Rekapitulasi per Hari
          </h3>
          <span className="text-xs text-slate-400">
            Terurut dari tanggal terbaru
          </span>
        </div>

        {dailySummaries.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Belum ada data perhitungan yang tersimpan. Lakukan kalkulasi pada tab Kalkulator lalu klik Simpan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-center">Jumlah Trx</th>
                  <th className="py-3 px-4 text-right">Nilai Barang</th>
                  <th className="py-3 px-4 text-right">Total Selisih Zona</th>
                  <th className="py-3 px-4 text-right">Total Transaksi</th>
                  <th className="py-3 px-4 text-right">Hemat Promo</th>
                  <th className="py-3 px-4 text-center">Promo Sabar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {dailySummaries.map((summary) => (
                  <tr key={summary.dateKey} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-sans font-semibold text-white">
                      {summary.dateLabel}
                    </td>
                    <td className="py-3 px-4 text-center tabular-nums text-slate-300 font-bold">
                      {summary.count}x
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                      {formatRupiah(summary.totalHargaBarang)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-sky-400 font-semibold">
                      {formatRupiah(summary.totalBiayaSelisih)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-emerald-400 font-bold">
                      {formatRupiah(summary.totalTransaksi)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-amber-300">
                      {summary.totalHematPromo > 0 ? formatRupiah(summary.totalHematPromo) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      <span className="text-slate-300">
                        {summary.promoSabarCount}
                      </span>
                      <span className="text-slate-500"> / {summary.count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Breakdown Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Distribusi Wilayah Zona */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Distribusi Transaksi Berdasarkan Zona
          </h4>
          <div className="space-y-2">
            {Object.entries(zoneCounts).length === 0 ? (
              <p className="text-xs text-slate-500">Belum ada data zona.</p>
            ) : (
              Object.entries(zoneCounts).map(([zoneName, count]) => {
                const pct = Math.round((count / history.length) * 100);
                return (
                  <div key={zoneName} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{zoneName}</span>
                      <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                        {count} trx ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Card 2: Penggunaan Promo Sabar */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Efektivitas Promo Sabar
            </h4>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {history.length > 0 ? Math.round((totalPromoSabarUsed / history.length) * 100) : 0}%
            </span>
            <span className="text-xs text-slate-300">
              transaksi memanfaatkan Promo Sabar
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Promo Sabar memberikan potongan 5% selisih tarif untuk setiap zona (Zona 2 gratis, Zona 3: 5%, Zona 4: 10%, Zona 5: 13%).
          </p>
        </div>
      </div>
    </div>
  );
}
