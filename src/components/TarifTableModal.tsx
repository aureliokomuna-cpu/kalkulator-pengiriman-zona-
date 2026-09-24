import { ZONE_LIST } from '../constants/zones';
import { X, Sparkles, CheckCircle, Info } from 'lucide-react';

interface TarifTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TarifTableModal({ isOpen, onClose }: TarifTableModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Struktur Tiering Zona & Promo Sabar
              </h3>
              <p className="text-xs text-slate-400">
                Pedoman tarif selisih ongkir berdasarkan tiering jarak dan program promosi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tier Zona</th>
                  <th className="py-3 px-4">Tarif Reguler</th>
                  <th className="py-3 px-4 text-emerald-400">Tarif Promo Sabar</th>
                  <th className="py-3 px-4">Penghematan</th>
                  <th className="py-3 px-4">Jangkauan Wilayah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {ZONE_LIST.map((zone) => {
                  const hemat = zone.standardPercent - zone.promoSabarPercent;
                  return (
                    <tr key={zone.id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-sans font-semibold text-white flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        />
                        {zone.name}
                      </td>
                      <td className="py-3 px-4 text-slate-300 tabular-nums">
                        {zone.standardPercent}%
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        {zone.promoSabarPercent === 0 ? (
                          <span className="text-emerald-400 font-bold font-sans">
                            FREE (0%)
                          </span>
                        ) : (
                          <span className="text-amber-300 font-bold">
                            {zone.promoSabarPercent}%
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans text-emerald-400 tabular-nums font-semibold">
                        {hemat > 0 ? `Hemat ${hemat}%` : 'Normal'}
                      </td>
                      <td className="py-3 px-4 font-sans text-[11px] text-slate-400">
                        {zone.coverageArea}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Explanation block */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2 text-xs text-amber-200">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Sparkles className="h-4 w-4" />
              <span>Aturan Khusus PROMO SABAR</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Saat fitur <strong>Promo Sabar</strong> diaktifkan, seluruh zona mendapatkan potongan selisih 5% dari tarif normal:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 font-sans">
              <li><strong>Zona 2 (Lampung, Bali):</strong> Bebas biaya kirim selisih zona (<strong>GRATIS / 0%</strong>).</li>
              <li><strong>Zona 3 (Palembang, Sumsel, Medan, Padang, Bengkulu, Makassar, Manado, All Kalimantan):</strong> Tarif turun dari 10% menjadi <strong>5%</strong>.</li>
              <li><strong>Zona 4 (Kendari, Gorontalo, Ambon, Lombok):</strong> Tarif turun dari 15% menjadi <strong>10%</strong>.</li>
              <li><strong>Zona 5 (Papua, Aceh):</strong> Tarif turun dari 18% menjadi <strong>13%</strong>.</li>
            </ul>
          </div>

          {/* Formula Example */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
            <h4 className="font-bold text-white font-sans">Rumus Perhitungan</h4>
            <div className="font-mono bg-slate-900 p-2.5 rounded-lg text-emerald-400 text-[11px]">
              Biaya Selisih = Harga Barang &times; (% Tarif Tiering Zona)
              <br />
              Total Transaksi = Harga Barang + Biaya Selisih
            </div>
            <p className="text-slate-400 text-[11px]">
              Contoh: Pembelian barang Rp 2.000.000 ke Zona 3 dengan Promo Sabar (5%):
              <br />
              Biaya Selisih = 2.000.000 &times; 5% = <strong>Rp 100.000</strong> (Normal Rp 200.000). Total bayar: <strong>Rp 2.100.000</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
