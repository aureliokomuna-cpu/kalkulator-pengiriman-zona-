import { useState } from 'react';
import { ZoneDefinition, ZoneId } from '../types/zone';
import { ZONE_DEFINITIONS } from '../constants/zones';
import { formatRupiah } from '../utils/formatters';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Table } from 'lucide-react';

interface ZoneComparisonTableProps {
  hargaBarang: number;
  isPromoSabar: boolean;
  selectedZoneId: ZoneId;
  onSelectZone: (zoneId: ZoneId) => void;
}

export function ZoneComparisonTable({
  hargaBarang,
  isPromoSabar,
  selectedZoneId,
  onSelectZone,
}: ZoneComparisonTableProps) {
  const [isOpen, setIsOpen] = useState(false);

  const comparisonZones: ZoneDefinition[] = [
    ZONE_DEFINITIONS.ZONA_2,
    ZONE_DEFINITIONS.ZONA_3,
    ZONE_DEFINITIONS.ZONA_4,
    ZONE_DEFINITIONS.ZONA_5,
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden transition-all">
      {/* Header bar that toggles */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
            <Table className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Tabel Perbandingan Semua Zona</span>
              <span className="text-[11px] font-normal text-slate-400">
                (Simulasi {formatRupiah(hargaBarang)})
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              {isOpen ? 'Klik untuk menciutkan tabel' : 'Bandingkan biaya Zona 2, 3, 4, dan 5 secara berdampingan'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
          <span>{isOpen ? 'Tutup' : 'Buka Tabel'}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expandable Table Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-slate-800/80 space-y-3 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Zona & Wilayah</th>
                  <th className="py-2.5 px-3">Tarif Normal</th>
                  <th className="py-2.5 px-3 text-emerald-400">Tarif Promo Sabar</th>
                  <th className="py-2.5 px-3 text-right">Biaya Selisih</th>
                  <th className="py-2.5 px-3 text-right">Total Transaksi</th>
                  <th className="py-2.5 px-3 text-center">Pilihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {comparisonZones.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  const appliedRate = isPromoSabar ? zone.promoSabarPercent : zone.standardPercent;
                  const selisih = Math.round(hargaBarang * (appliedRate / 100));
                  const total = hargaBarang + selisih;
                  const isFree = appliedRate === 0;

                  return (
                    <tr
                      key={zone.id}
                      onClick={() => onSelectZone(zone.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-500/10 text-white font-semibold'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="py-3 px-3 font-sans">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: zone.color }}
                          />
                          <span className="font-bold text-white">{zone.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5 max-w-xs truncate">
                          {zone.coverageArea}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400 tabular-nums">
                        {zone.standardPercent}%
                      </td>
                      <td className="py-3 px-3 tabular-nums">
                        {zone.promoSabarPercent === 0 ? (
                          <span className="text-emerald-400 font-bold font-sans">
                            FREE (0%)
                          </span>
                        ) : (
                          <span className="text-amber-300 font-bold font-mono">
                            {zone.promoSabarPercent}%
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold tabular-nums">
                        {isFree ? (
                          <span className="text-emerald-400 font-sans font-bold">
                            GRATIS (Rp 0)
                          </span>
                        ) : (
                          <span className="text-slate-100">{formatRupiah(selisih)}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                        {formatRupiah(total)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Terpilih</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300">
                            <span>Pilih</span>
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
