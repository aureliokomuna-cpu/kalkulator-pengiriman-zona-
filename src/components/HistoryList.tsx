import { useState, useMemo } from 'react';
import { HistoryItem, ZoneId } from '../types/zone';
import { formatRupiah, generateReceiptText, exportHistoryToCSV, formatDateKey } from '../utils/formatters';
import {
  Search,
  Download,
  Trash2,
  Copy,
  Printer,
  Sparkles,
  ArrowUpRight,
  Filter,
  Check,
  Receipt
} from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onSelectForEdit: (item: HistoryItem) => void;
  onOpenReceiptModal: (item: HistoryItem) => void;
}

export function HistoryList({
  history,
  onDelete,
  onClearAll,
  onSelectForEdit,
  onOpenReceiptModal,
}: HistoryListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days'>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [promoFilter, setPromoFilter] = useState<'all' | 'promo' | 'regular'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Filter history
  const filteredHistory = useMemo(() => {
    const todayKey = formatDateKey();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoTime = sevenDaysAgo.getTime();

    return history.filter(item => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchInvoice = item.orderNo?.toLowerCase().includes(q);
        const matchCustomer = item.customerName?.toLowerCase().includes(q);
        const matchZone = item.zoneName.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        const matchAmount = item.totalTransaksi.toString().includes(q) || item.hargaBarang.toString().includes(q);
        if (!matchInvoice && !matchCustomer && !matchZone && !matchNotes && !matchAmount) {
          return false;
        }
      }

      // Date
      if (dateFilter === 'today' && item.dateKey !== todayKey) return false;
      if (dateFilter === '7days' && item.timestamp < sevenDaysAgoTime) return false;

      // Zone
      if (zoneFilter !== 'all' && item.zoneId !== zoneFilter) return false;

      // Promo
      if (promoFilter === 'promo' && !item.isPromoSabar) return false;
      if (promoFilter === 'regular' && item.isPromoSabar) return false;

      return true;
    });
  }, [history, searchQuery, dateFilter, zoneFilter, promoFilter]);

  const handleCopy = async (item: HistoryItem) => {
    const text = generateReceiptText({
      orderNo: item.orderNo,
      customerName: item.customerName,
      notes: item.notes,
      hargaBarang: item.hargaBarang,
      zoneName: item.zoneName,
      isPromoSabar: item.isPromoSabar,
      nominalRate: item.nominalRate,
      appliedRate: item.appliedRate,
      biayaSelisih: item.biayaSelisih,
      hematDiskon: item.hematDiskon,
      totalTransaksi: item.totalTransaksi,
      timestamp: item.timestamp,
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Log Riwayat Perhitungan Transaksi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar seluruh kalkulasi yang tersimpan. Salin format pesan atau muat kembali ke kalkulator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportHistoryToCSV(filteredHistory)}
            disabled={filteredHistory.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {history.length > 0 && (
            confirmClear ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 transition-colors"
                >
                  Yakin Hapus Semua?
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="rounded-lg bg-slate-800 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400 hover:border-rose-900 hover:text-rose-400 transition-colors"
                title="Hapus semua riwayat"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Bersihkan</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="sm:col-span-1 relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari customer / invoice..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Date Filter Tabs */}
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setDateFilter('all')}
            className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
              dateFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setDateFilter('today')}
            className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
              dateFilter === 'today' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={() => setDateFilter('7days')}
            className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
              dateFilter === '7days' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Hari
          </button>
        </div>

        {/* Zone Filter */}
        <div>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 px-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Zona</option>
            <option value="ZONA_2">Zona 2 (Lampung, Bali)</option>
            <option value="ZONA_3">Zona 3 (Palembang, Medan, Makassar, Kalimantan, dll)</option>
            <option value="ZONA_4">Zona 4 (Kendari, Gorontalo, Ambon, Lombok)</option>
            <option value="ZONA_5">Zona 5 (Papua, Aceh)</option>
          </select>
        </div>

        {/* Promo Filter */}
        <div>
          <select
            value={promoFilter}
            onChange={(e) => setPromoFilter(e.target.value as any)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 px-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Jenis Tarif</option>
            <option value="promo">Hanya Promo Sabar</option>
            <option value="regular">Hanya Tarif Reguler</option>
          </select>
        </div>
      </div>

      {/* History Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Receipt className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              Tidak ada data riwayat yang cocok
            </p>
            <p className="text-xs text-slate-500">
              Coba sesuaikan kata kunci pencarian atau filter di atas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Order / Customer</th>
                  <th className="py-3 px-4">Zona & Tarif</th>
                  <th className="py-3 px-4 text-right">Harga Barang</th>
                  <th className="py-3 px-4 text-right">Selisih Zona</th>
                  <th className="py-3 px-4 text-right">Total Transaksi</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredHistory.map((item) => {
                  const isCopied = copiedId === item.id;
                  const isFree = item.biayaSelisih === 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Date & Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-sans font-medium text-white">
                          {item.timeFormatted}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.dateFormatted}
                        </div>
                      </td>

                      {/* Order / Customer */}
                      <td className="py-3 px-4 font-sans max-w-[180px] truncate">
                        <div className="font-semibold text-white truncate">
                          {item.customerName || item.orderNo || 'Penjualan Langsung'}
                        </div>
                        {item.orderNo && item.customerName && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.orderNo}
                          </div>
                        )}
                        {item.notes && (
                          <div className="text-[10px] text-slate-400 truncate italic">
                            {item.notes}
                          </div>
                        )}
                      </td>

                      {/* Zone & Rate */}
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-200">
                            {item.zoneName}
                          </span>
                          {item.isPromoSabar && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
                              <Sparkles className="h-2.5 w-2.5" />
                              SABAR
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Rate: {item.appliedRate}%
                          {item.isPromoSabar && item.nominalRate !== item.appliedRate && (
                            <span className="line-through text-slate-500 ml-1">
                              {item.nominalRate}%
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Harga Barang */}
                      <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                        {formatRupiah(item.hargaBarang)}
                      </td>

                      {/* Selisih Zona */}
                      <td className="py-3 px-4 text-right tabular-nums">
                        <span className={`font-semibold ${isFree ? 'text-emerald-400' : 'text-sky-400'}`}>
                          {isFree ? 'FREE' : formatRupiah(item.biayaSelisih)}
                        </span>
                        {item.hematDiskon > 0 && (
                          <div className="text-[10px] text-emerald-400">
                            Hemat {formatRupiah(item.hematDiskon)}
                          </div>
                        )}
                      </td>

                      {/* Total Transaksi */}
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-white">
                        {formatRupiah(item.totalTransaksi)}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-center font-sans">
                        <div className="flex items-center justify-center gap-1">
                          {/* Copy WhatsApp */}
                          <button
                            type="button"
                            onClick={() => handleCopy(item)}
                            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Salin Rincian ke WhatsApp"
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {/* Print / Struk */}
                          <button
                            type="button"
                            onClick={() => onOpenReceiptModal(item)}
                            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Buka Struk / Cetak"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>

                          {/* Load into calculator */}
                          <button
                            type="button"
                            onClick={() => onSelectForEdit(item)}
                            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Muat ke Kalkulator"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => onDelete(item.id)}
                            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Hapus riwayat ini"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
