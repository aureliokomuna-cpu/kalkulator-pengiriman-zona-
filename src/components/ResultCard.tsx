import { useState } from 'react';
import { CalculationResult, HistoryItem } from '../types/zone';
import { formatRupiah, generateReceiptText } from '../utils/formatters';
import { Save, Copy, Check, Printer, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultCardProps {
  calculation: CalculationResult;
  orderNo: string;
  customerName: string;
  notes: string;
  onSave: () => HistoryItem;
  onOpenReceipt: () => void;
}

export function ResultCard({
  calculation,
  orderNo,
  customerName,
  notes,
  onSave,
  onOpenReceipt,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopyWA = async () => {
    const text = generateReceiptText({
      orderNo,
      customerName,
      notes,
      hargaBarang: calculation.hargaBarang,
      zoneName: `${calculation.selectedZone.name} (${calculation.selectedZone.coverageArea})`,
      isPromoSabar: calculation.isPromoSabar,
      nominalRate: calculation.nominalRatePercent,
      appliedRate: calculation.appliedRatePercent,
      biayaSelisih: calculation.biayaSelisih,
      hematDiskon: calculation.hematDiskon,
      totalTransaksi: calculation.totalTransaksi,
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSave = () => {
    onSave();
    setSavedSuccess(true);
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#fbbf24'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const isFree = calculation.biayaSelisih === 0;

  return (
    <div className="sticky top-20 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-md p-5 sm:p-6 shadow-xl space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Hasil Perhitungan</span>
        </h3>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          Otomatis
        </span>
      </div>

      {/* Rincian Ringkas */}
      <div className="space-y-3 text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Harga Barang:</span>
          <span className="font-mono font-bold text-white tabular-nums text-base">
            {formatRupiah(calculation.hargaBarang)}
          </span>
        </div>

        {/* Zona Terpilih */}
        <div className="flex items-start justify-between">
          <span className="text-slate-400">Tujuan Zona:</span>
          <div className="text-right">
            <div className="font-bold text-white">
              {calculation.selectedZone.name} ({calculation.appliedRatePercent}%)
            </div>
            <div className="text-[11px] text-slate-400 max-w-[200px] truncate">
              {calculation.selectedZone.coverageArea}
            </div>
          </div>
        </div>

        {/* Biaya Selisih */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Biaya Selisih:</span>
          <span className={`font-mono font-bold tabular-nums text-base ${isFree ? 'text-emerald-400' : 'text-white'}`}>
            {isFree ? 'GRATIS (Rp 0)' : formatRupiah(calculation.biayaSelisih)}
          </span>
        </div>

        {/* Hemat Promo Sabar */}
        {calculation.isPromoSabar && calculation.hematDiskon > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-3 py-2 text-xs text-emerald-300">
            <span className="flex items-center gap-1 font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Hemat Promo Sabar:
            </span>
            <span className="font-mono font-bold tabular-nums text-sm">
              -{formatRupiah(calculation.hematDiskon)}
            </span>
          </div>
        )}

        {/* Kotak Grand Total Besar */}
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            TOTAL YANG HARUS DIBAYAR
          </div>
          <div className="mt-1 font-mono text-3xl font-black text-emerald-400 tracking-tight tabular-nums">
            {formatRupiah(calculation.totalTransaksi)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Harga Barang + Selisih {calculation.selectedZone.name}
          </div>
        </div>
      </div>

      {/* Tombol Aksi Utama */}
      <div className="space-y-2.5 pt-1">
        {/* Tombol SIMPAN (+1 COUNTER) */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-black text-slate-950 hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-slate-950" />
              <span>Tersimpan ke Riwayat & Counter!</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Simpan & Catat Transaksi (+1)</span>
            </>
          )}
        </button>

        {/* Tombol Salin WA & Cetak Struk */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyWA}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-300" />
                <span>Salin WA</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenReceipt}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
          >
            <Printer className="h-4 w-4 text-slate-300" />
            <span>Lihat Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
}
