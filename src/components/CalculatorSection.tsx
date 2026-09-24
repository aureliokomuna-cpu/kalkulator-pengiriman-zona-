import React from 'react';
import { ZoneId, CalculationResult } from '../types/zone';
import { ZONE_LIST, NOMINAL_PRESETS } from '../constants/zones';
import { formatRupiah, parseRupiahInput } from '../utils/formatters';
import { Sparkles, Check, RotateCcw } from 'lucide-react';

interface CalculatorSectionProps {
  hargaBarang: number;
  setHargaBarang: (val: number) => void;
  selectedZoneId: ZoneId;
  setSelectedZoneId: (val: ZoneId) => void;
  isPromoSabar: boolean;
  setIsPromoSabar: (val: boolean) => void;
  orderNo: string;
  setOrderNo: (val: string) => void;
  customerName: string;
  setCustomerName: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  calculation: CalculationResult;
}

export function CalculatorSection({
  hargaBarang,
  setHargaBarang,
  selectedZoneId,
  setSelectedZoneId,
  isPromoSabar,
  setIsPromoSabar,
}: CalculatorSectionProps) {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseRupiahInput(e.target.value);
    setHargaBarang(parsed);
  };

  const handleAddPreset = (amount: number) => {
    setHargaBarang(hargaBarang + amount);
  };

  const handleClear = () => {
    setHargaBarang(0);
  };

  return (
    <div className="space-y-4">
      {/* 1. INPUT HARGA BARANG */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Harga Barang
          </label>
          {hargaBarang > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Big clean currency input */}
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 font-mono font-bold text-xl text-emerald-400">
            Rp
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={hargaBarang === 0 ? '' : hargaBarang.toLocaleString('id-ID')}
            onChange={handlePriceChange}
            placeholder="0"
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-3 pl-13 pr-4 font-mono text-2xl sm:text-3xl font-bold text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {NOMINAL_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleAddPreset(preset.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-all active:scale-95"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SAKELAR PROMO SABAR */}
      <div
        onClick={() => setIsPromoSabar(!isPromoSabar)}
        className={`cursor-pointer rounded-2xl border p-4 transition-all flex items-center justify-between gap-3 ${
          isPromoSabar
            ? 'border-emerald-500/40 bg-emerald-950/20'
            : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
              isPromoSabar
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Promo Sabar</span>
              {isPromoSabar ? (
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                  Aktif
                </span>
              ) : (
                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 uppercase">
                  Off
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {isPromoSabar
                ? 'Zona 2: FREE (0%) • Zona 3: 5% • Zona 4: 10% • Zona 5: 13%'
                : 'Tarif Reguler (Zona 2: 5%, Zona 3: 10%, Zona 4: 15%, Zona 5: 18%)'}
            </div>
          </div>
        </div>

        {/* Clean Switch Toggle */}
        <div
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            isPromoSabar ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isPromoSabar ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </div>

      {/* 3. PILIH ZONA */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pilih Zona Tujuan
          </span>
          <span className="text-xs text-slate-400">
            Tarif: <strong className="text-emerald-400">{isPromoSabar ? 'Promo Sabar' : 'Reguler'}</strong>
          </span>
        </div>

        {/* 4 Clean Cards (Zona 2, Zona 3, Zona 4, Zona 5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ZONE_LIST.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const appliedRate = isPromoSabar ? zone.promoSabarPercent : zone.standardPercent;
            const isFree = appliedRate === 0;
            const biayaSelisih = Math.round(hargaBarang * (appliedRate / 100));

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZoneId(zone.id)}
                className={`relative flex flex-col justify-between rounded-2xl p-4 text-left transition-all active:scale-[0.99] border ${
                  isSelected
                    ? 'border-emerald-500 bg-slate-900 shadow-md shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Header: Name + Rate */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: zone.color }}
                    />
                    <span className="font-extrabold text-white text-base">
                      {zone.name}
                    </span>
                  </div>

                  {isFree ? (
                    <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-black text-slate-950 uppercase">
                      FREE (0%)
                    </span>
                  ) : (
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-bold font-mono ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {appliedRate}%
                    </span>
                  )}
                </div>

                {/* Coverage text */}
                <div className="my-2.5 text-xs text-slate-300 font-normal leading-relaxed line-clamp-2">
                  {zone.coverageArea}
                </div>

                {/* Footer: Live Selisih */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                  <span className="text-slate-400">Selisih Ongkir:</span>
                  <span className={`font-mono font-bold tabular-nums ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                    {isFree ? 'Rp 0 (GRATIS)' : formatRupiah(biayaSelisih)}
                  </span>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-3.5 right-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
