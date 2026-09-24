import { Calculator, BarChart3, History, Info, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'calculator' | 'monitoring' | 'history';
  setActiveTab: (tab: 'calculator' | 'monitoring' | 'history') => void;
  onOpenTarifModal: () => void;
  onOpenTutorialModal: () => void;
  todayCount: number;
  totalCount: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenTarifModal,
  onOpenTutorialModal,
  todayCount,
  totalCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        {/* Brand / Title */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>Kalkulator Zona</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400">
                PROMO SABAR
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400">
              Tiering Zona 2, 3, 4, 5
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'calculator'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Kalkulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monitoring')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'monitoring'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Rekap Harian</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Riwayat</span>
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-300">
              {totalCount}
            </span>
          </button>
        </nav>

        {/* Info & Counter Badge */}
        <div className="flex items-center gap-2">
          {/* Tutorial Button */}
          <button
            type="button"
            onClick={onOpenTutorialModal}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            title="Panduan Singkat Penggunaan"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
            <span>Panduan</span>
          </button>

          {/* Tarif Modal Button */}
          <button
            type="button"
            onClick={onOpenTarifModal}
            className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
            title="Lihat Daftar Persentase Tarif"
          >
            <Info className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Tabel Tarif</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Hari ini:</span>
            <span className="font-mono font-bold text-emerald-400 tabular-nums">
              {todayCount}x
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
