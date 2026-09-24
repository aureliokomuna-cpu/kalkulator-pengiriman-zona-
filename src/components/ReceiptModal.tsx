import { useState } from 'react';
import { HistoryItem, CalculationResult } from '../types/zone';
import { ZONE_DEFINITIONS } from '../constants/zones';
import { formatRupiah, generateReceiptText } from '../utils/formatters';
import { X, Printer, Copy, Check, Sparkles } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HistoryItem | CalculationResult | null;
  orderNo?: string;
  customerName?: string;
  notes?: string;
}

export function ReceiptModal({
  isOpen,
  onClose,
  data,
  orderNo = '',
  customerName = '',
  notes = '',
}: ReceiptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  // Normalize data whether it comes from HistoryItem or CalculationResult
  const isHistory = 'timestamp' in data;
  const hargaBarang = data.hargaBarang;
  const zoneName = isHistory ? (data as HistoryItem).zoneName : (data as CalculationResult).selectedZone.name;
  const zoneId = isHistory ? (data as HistoryItem).zoneId : (data as CalculationResult).selectedZone.id;
  const coverageArea = ZONE_DEFINITIONS[zoneId]?.coverageArea || '';
  const isPromoSabar = data.isPromoSabar;
  const nominalRate = isHistory ? (data as HistoryItem).nominalRate : (data as CalculationResult).nominalRatePercent;
  const appliedRate = isHistory ? (data as HistoryItem).appliedRate : (data as CalculationResult).appliedRatePercent;
  const biayaSelisih = data.biayaSelisih;
  const hematDiskon = data.hematDiskon;
  const totalTransaksi = data.totalTransaksi;
  const displayOrderNo = isHistory ? (data as HistoryItem).orderNo : orderNo;
  const displayCustomer = isHistory ? (data as HistoryItem).customerName : customerName;
  const displayNotes = isHistory ? (data as HistoryItem).notes : notes;
  const timeFormatted = isHistory ? `${(data as HistoryItem).dateFormatted} ${(data as HistoryItem).timeFormatted}` : 'Hari Ini';

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const text = generateReceiptText({
      orderNo: displayOrderNo,
      customerName: displayCustomer,
      notes: displayNotes,
      hargaBarang,
      zoneName,
      isPromoSabar,
      nominalRate,
      appliedRate,
      biayaSelisih,
      hematDiskon,
      totalTransaksi,
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white text-slate-900 shadow-2xl overflow-hidden print:m-0 print:p-0 print:shadow-none print:w-full">
        {/* Top bar controls */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pratinjau Struk / Bukti Transaksi
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Printer className="h-3 w-3" />
              <span>Cetak</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Struk Body */}
        <div className="p-6 font-mono text-xs space-y-4">
          <div className="text-center pb-2 border-b border-dashed border-slate-300">
            <h2 className="text-base font-bold font-sans tracking-tight text-slate-900">
              NOTA PERHITUNGAN BIAYA
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Selisih Harga Zona Logistik & Distribusi
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Waktu: {timeFormatted}
            </p>
          </div>

          {/* Customer / Order metadata */}
          {(displayOrderNo || displayCustomer) && (
            <div className="space-y-1 pb-2 border-b border-dashed border-slate-300 text-[11px]">
              {displayOrderNo && (
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Order:</span>
                  <span className="font-semibold text-slate-800">{displayOrderNo}</span>
                </div>
              )}
              {displayCustomer && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-semibold text-slate-800">{displayCustomer}</span>
                </div>
              )}
            </div>
          )}

          {/* Line items */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal Barang:</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {formatRupiah(hargaBarang)}
              </span>
            </div>

            <div>
              <div className="flex justify-between">
                <span className="text-slate-600">Zona Alamat:</span>
                <span className="font-semibold text-slate-900">{zoneName}</span>
              </div>
              {coverageArea && (
                <div className="text-[10px] text-slate-500 text-right mt-0.5">
                  ({coverageArea})
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">Skema Tarif:</span>
              <span>
                {isPromoSabar ? (
                  <span className="text-amber-700 font-bold">PROMO SABAR ({appliedRate}%)</span>
                ) : (
                  <span className="text-slate-800">Reguler ({appliedRate}%)</span>
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">Biaya Selisih Zona:</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {biayaSelisih === 0 ? 'GRATIS (Rp 0)' : formatRupiah(biayaSelisih)}
              </span>
            </div>

            {isPromoSabar && hematDiskon > 0 && (
              <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                <span className="flex items-center gap-1 font-semibold">
                  <Sparkles className="h-3 w-3" />
                  Hemat Promo Sabar:
                </span>
                <span className="font-bold tabular-nums">
                  -{formatRupiah(hematDiskon)}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-slate-900 my-2 pt-2">
            <div className="flex justify-between items-baseline text-sm font-bold text-slate-950 font-sans">
              <span>TOTAL PEMBAYARAN</span>
              <span className="font-mono text-base tabular-nums">
                {formatRupiah(totalTransaksi)}
              </span>
            </div>
          </div>

          {displayNotes && (
            <div className="bg-slate-50 p-2 rounded text-[10px] text-slate-600 italic">
              Catatan: {displayNotes}
            </div>
          )}

          <div className="text-center pt-2 text-[10px] text-slate-400 font-sans">
            Simpan struk ini sebagai bukti rincian pengiriman barang.
          </div>
        </div>
      </div>
    </div>
  );
}
