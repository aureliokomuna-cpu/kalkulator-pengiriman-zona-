import { useState } from 'react';
import { useZoneCalculator } from './hooks/useZoneCalculator';
import { Navbar } from './components/Navbar';
import { StatsCounterBar } from './components/StatsCounterBar';
import { CalculatorSection } from './components/CalculatorSection';
import { ResultCard } from './components/ResultCard';
import { ZoneComparisonTable } from './components/ZoneComparisonTable';
import { DailyMonitoring } from './components/DailyMonitoring';
import { HistoryList } from './components/HistoryList';
import { TarifTableModal } from './components/TarifTableModal';
import { ReceiptModal } from './components/ReceiptModal';
import { TutorialModal } from './components/TutorialModal';
import { HistoryItem, ZoneId } from './types/zone';
import { formatRupiah, generateReceiptText } from './utils/formatters';
import { History, Copy, Check, ArrowRight, Clock, Sparkles } from 'lucide-react';

export default function App() {
  const {
    hargaBarang,
    setHargaBarang,
    selectedZoneId,
    setSelectedZoneId,
    isPromoSabar,
    setIsPromoSabar,
    orderNo,
    setOrderNo,
    customerName,
    setCustomerName,
    notes,
    setNotes,
    currentCalculation,
    recordCalculation,
    history,
    deleteHistoryItem,
    clearHistory,
    resetToSampleData,
    counterStats,
    dailySummaries,
  } = useZoneCalculator();

  const [activeTab, setActiveTab] = useState<'calculator' | 'monitoring' | 'history'>('calculator');
  const [isTarifModalOpen, setIsTarifModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [receiptModalData, setReceiptModalData] = useState<HistoryItem | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [copiedMiniId, setCopiedMiniId] = useState<string | null>(null);

  // When clicking "Lihat Struk" from calculator result card
  const handleOpenCurrentReceipt = () => {
    setReceiptModalData(null);
    setIsReceiptModalOpen(true);
  };

  // When clicking "Lihat Struk" from history row
  const handleOpenHistoryReceipt = (item: HistoryItem) => {
    setReceiptModalData(item);
    setIsReceiptModalOpen(true);
  };

  // When user clicks "Muat ke Kalkulator" from history
  const handleLoadFromHistory = (item: HistoryItem) => {
    setHargaBarang(item.hargaBarang);
    setSelectedZoneId(item.zoneId);
    setIsPromoSabar(item.isPromoSabar);
    setOrderNo(item.orderNo || '');
    setCustomerName(item.customerName || '');
    setNotes(item.notes || '');
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyMini = async (item: HistoryItem) => {
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
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMiniId(item.id);
      setTimeout(() => setCopiedMiniId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTarifModal={() => setIsTarifModalOpen(true)}
        onOpenTutorialModal={() => setIsTutorialModalOpen(true)}
        todayCount={counterStats.todayCalculations}
        totalCount={counterStats.totalCalculations}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5">
        {/* Top Counter Bar */}
        <StatsCounterBar stats={counterStats} />

        {/* Tab 1: Calculator Workspace */}
        {activeTab === 'calculator' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Input, Promo Sabar Switch, Zone Cards */}
              <div className="lg:col-span-7 xl:col-span-8">
                <CalculatorSection
                  hargaBarang={hargaBarang}
                  setHargaBarang={setHargaBarang}
                  selectedZoneId={selectedZoneId}
                  setSelectedZoneId={setSelectedZoneId}
                  isPromoSabar={isPromoSabar}
                  setIsPromoSabar={setIsPromoSabar}
                  orderNo={orderNo}
                  setOrderNo={setOrderNo}
                  customerName={customerName}
                  setCustomerName={setCustomerName}
                  notes={notes}
                  setNotes={setNotes}
                  calculation={currentCalculation}
                />
              </div>

              {/* Right Column: Live Calculation Breakdown & Receipt */}
              <div className="lg:col-span-5 xl:col-span-4">
                <ResultCard
                  calculation={currentCalculation}
                  orderNo={orderNo}
                  customerName={customerName}
                  notes={notes}
                  onSave={recordCalculation}
                  onOpenReceipt={handleOpenCurrentReceipt}
                />
              </div>
            </div>

            {/* Optional Expandable Simulation Comparison Table */}
            <ZoneComparisonTable
              hargaBarang={hargaBarang}
              isPromoSabar={isPromoSabar}
              selectedZoneId={selectedZoneId}
              onSelectZone={(zoneId: ZoneId) => setSelectedZoneId(zoneId)}
            />

            {/* Recent Quick History Feed directly on Calculator tab */}
            {history.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">
                      Transaksi Tersimpan Terakhir
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Lihat Semua ({history.length})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {history.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3 flex flex-col justify-between text-xs space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3 text-slate-500" />
                          {item.timeFormatted} ({item.dateFormatted})
                        </span>
                        {item.isPromoSabar ? (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Sparkles className="h-2.5 w-2.5" />
                            SABAR
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Reguler</span>
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-white text-sm">
                          {item.zoneName}
                        </div>
                        <div className="flex justify-between items-baseline mt-1 text-slate-300">
                          <span>Barang: {formatRupiah(item.hargaBarang)}</span>
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {formatRupiah(item.totalTransaksi)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleLoadFromHistory(item)}
                          className="text-slate-400 hover:text-white"
                        >
                          Hitung Ulang
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyMini(item)}
                          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                        >
                          {copiedMiniId === item.id ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Salin WA</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Daily Monitoring & Rekap Harian */}
        {activeTab === 'monitoring' && (
          <div className="animate-fade-in">
            <DailyMonitoring
              dailySummaries={dailySummaries}
              history={history}
              onResetSample={resetToSampleData}
              onClearHistory={clearHistory}
            />
          </div>
        )}

        {/* Tab 3: Detailed History Log */}
        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <HistoryList
              history={history}
              onDelete={deleteHistoryItem}
              onClearAll={clearHistory}
              onSelectForEdit={handleLoadFromHistory}
              onOpenReceiptModal={handleOpenHistoryReceipt}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-5 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Kalkulator Selisih Harga Zona &bull; Zona 2 (5%), Zona 3 (10%), Zona 4 (15%), Zona 5 (18%) &bull; Promo Sabar
          </div>
          <div className="text-slate-400 font-mono">
            {counterStats.todayCalculations}x hari ini &bull; Total: {counterStats.totalCalculations}x
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TutorialModal
        isOpen={isTutorialModalOpen}
        onClose={() => setIsTutorialModalOpen(false)}
      />

      <TarifTableModal
        isOpen={isTarifModalOpen}
        onClose={() => setIsTarifModalOpen(false)}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        data={receiptModalData || currentCalculation}
        orderNo={orderNo}
        customerName={customerName}
        notes={notes}
      />
    </div>
  );
}
