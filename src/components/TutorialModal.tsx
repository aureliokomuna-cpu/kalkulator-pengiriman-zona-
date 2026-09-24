import { X, Check, DollarSign, MapPin, Sparkles, Send, ArrowRight } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'Masukkan Harga Barang',
      desc: 'Ketik nominal barang atau gunakan tombol cepat (+500 rb, +1 jt, +2 jt, +5 jt).',
      icon: DollarSign,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      num: '2',
      title: 'Pilih Zona Tujuan',
      desc: 'Klik salah satu zona (Zona 2, 3, 4, atau 5) sesuai daerah tujuan barang.',
      icon: MapPin,
      color: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    },
    {
      num: '3',
      title: 'Aktifkan Promo Sabar (Bila Ada)',
      desc: 'Secara default tarif normal. Klik sakelar Promo Sabar jika ingin potongan khusus (Zona 2 GRATIS, Zona 3: 5%, Zona 4: 10%, Zona 5: 13%).',
      icon: Sparkles,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      num: '4',
      title: 'Simpan & Salin ke WA',
      desc: 'Klik "Simpan Transaksi (+1)" agar masuk ke hitungan counter harian, atau klik "Salin WA" untuk kirim rincian ke konsumen.',
      icon: Send,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Cara Penggunaan Aplikasi
              </h3>
              <p className="text-xs text-slate-400">
                Panduan praktis 4 langkah cepat
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border font-bold text-xs ${s.color}`}
                >
                  {s.num}
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{s.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with understood button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 active:scale-[0.99] transition-all shadow-md shadow-emerald-500/20"
          >
            <Check className="h-4 w-4 stroke-[3]" />
            <span>Saya Mengerti, Mulai Hitung</span>
          </button>
        </div>
      </div>
    </div>
  );
}
