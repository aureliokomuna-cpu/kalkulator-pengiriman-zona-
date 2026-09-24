import { useState, useEffect, useMemo, useCallback } from 'react';
import { ZoneId, CalculationResult, HistoryItem, DailySummary, CounterStats } from '../types/zone';
import { ZONE_DEFINITIONS } from '../constants/zones';
import { formatDateKey, formatHumanDate, formatHumanTime } from '../utils/formatters';

const STORAGE_KEY_HISTORY = 'app_zona_history_v2';
const STORAGE_KEY_TOTAL_COUNTER = 'app_zona_counter_v2';

// Seed sample data if local storage is completely empty, so user can see daily monitoring right away
function getInitialSampleHistory(): HistoryItem[] {
  const now = new Date();
  const todayKey = formatDateKey(now);
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  const twoDaysAgoKey = formatDateKey(twoDaysAgo);

  return [
    {
      id: 'trx-sample-1',
      timestamp: now.getTime() - 1000 * 60 * 35, // 35 mins ago
      dateKey: todayKey,
      timeFormatted: formatHumanTime(new Date(now.getTime() - 1000 * 60 * 35)),
      dateFormatted: formatHumanDate(now),
      orderNo: 'INV-202609-081',
      customerName: 'Bpk. Hendra Wijaya',
      notes: 'Tujuan: Medan (Zona 3) - Ekspedisi darat laut',
      hargaBarang: 4500000,
      zoneId: 'ZONA_3',
      zoneName: 'Zona 3 (Medan / Sumsel / Kalimantan)',
      isPromoSabar: true,
      nominalRate: 10,
      appliedRate: 5,
      biayaSelisih: 225000,
      hematDiskon: 225000,
      totalTransaksi: 4725000,
    },
    {
      id: 'trx-sample-2',
      timestamp: now.getTime() - 1000 * 60 * 95, // 95 mins ago
      dateKey: todayKey,
      timeFormatted: formatHumanTime(new Date(now.getTime() - 1000 * 60 * 95)),
      dateFormatted: formatHumanDate(now),
      orderNo: 'INV-202609-080',
      customerName: 'Ibu Ratna Sari',
      notes: 'Tujuan: Denpasar, Bali (Zona 2) - Promo Sabar FREE',
      hargaBarang: 1850000,
      zoneId: 'ZONA_2',
      zoneName: 'Zona 2 (Lampung & Bali)',
      isPromoSabar: true,
      nominalRate: 5,
      appliedRate: 0,
      biayaSelisih: 0,
      hematDiskon: 92500,
      totalTransaksi: 1850000,
    },
    {
      id: 'trx-sample-3',
      timestamp: now.getTime() - 1000 * 60 * 210, // 3.5 hrs ago
      dateKey: todayKey,
      timeFormatted: formatHumanTime(new Date(now.getTime() - 1000 * 60 * 210)),
      dateFormatted: formatHumanDate(now),
      orderNo: 'INV-202609-079',
      customerName: 'CV Mitra Kendari',
      notes: 'Tujuan: Kendari, Sulawesi Tenggara (Zona 4)',
      hargaBarang: 12000000,
      zoneId: 'ZONA_4',
      zoneName: 'Zona 4 (Kendari, Gorontalo, Ambon, Lombok)',
      isPromoSabar: false,
      nominalRate: 15,
      appliedRate: 15,
      biayaSelisih: 1800000,
      hematDiskon: 0,
      totalTransaksi: 13800000,
    },
    {
      id: 'trx-sample-4',
      timestamp: yesterday.getTime() - 1000 * 60 * 180,
      dateKey: yesterdayKey,
      timeFormatted: '15:20',
      dateFormatted: formatHumanDate(yesterday),
      orderNo: 'INV-202609-078',
      customerName: 'Toko Surya Papua',
      notes: 'Tujuan: Jayapura, Papua (Zona 5)',
      hargaBarang: 7200000,
      zoneId: 'ZONA_5',
      zoneName: 'Zona 5',
      isPromoSabar: true,
      nominalRate: 18,
      appliedRate: 13,
      biayaSelisih: 936000,
      hematDiskon: 360000,
      totalTransaksi: 8136000,
    },
    {
      id: 'trx-sample-5',
      timestamp: yesterday.getTime() - 1000 * 60 * 300,
      dateKey: yesterdayKey,
      timeFormatted: '11:15',
      dateFormatted: formatHumanDate(yesterday),
      orderNo: 'INV-202609-077',
      customerName: 'Bpk. Donny Pratama',
      notes: 'Tujuan: Bandar Lampung (Zona 2)',
      hargaBarang: 3100000,
      zoneId: 'ZONA_2',
      zoneName: 'Zona 2 (Lampung & Bali)',
      isPromoSabar: false,
      nominalRate: 5,
      appliedRate: 5,
      biayaSelisih: 155000,
      hematDiskon: 0,
      totalTransaksi: 3255000,
    },
    {
      id: 'trx-sample-6',
      timestamp: twoDaysAgo.getTime() - 1000 * 60 * 200,
      dateKey: twoDaysAgoKey,
      timeFormatted: '14:45',
      dateFormatted: formatHumanDate(twoDaysAgo),
      orderNo: 'INV-202609-076',
      customerName: 'PT Sentosa Raya',
      notes: 'Perlengkapan Kantor',
      hargaBarang: 15400000,
      zoneId: 'ZONA_3',
      zoneName: 'Zona 3',
      isPromoSabar: true,
      nominalRate: 10,
      appliedRate: 5,
      biayaSelisih: 770000,
      hematDiskon: 770000,
      totalTransaksi: 16170000,
    }
  ];
}

export function useZoneCalculator() {
  const [hargaBarang, setHargaBarang] = useState<number>(2500000);
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId>('ZONA_2');
  const [isPromoSabar, setIsPromoSabar] = useState<boolean>(false);
  const [orderNo, setOrderNo] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(false);

  // History & All-Time Counter loaded from LocalStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (stored) {
        return JSON.parse(stored);
      }
      return getInitialSampleHistory();
    } catch {
      return getInitialSampleHistory();
    }
  });

  const [counterCount, setCounterCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TOTAL_COUNTER);
      if (stored) {
        return parseInt(stored, 10) || 0;
      }
      return 14; // Initial sample count
    } catch {
      return 14;
    }
  });

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Persist counter
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TOTAL_COUNTER, counterCount.toString());
    } catch (e) {
      console.error('Failed to save counter to localStorage', e);
    }
  }, [counterCount]);

  // Selected Zone Object
  const selectedZone = useMemo(() => {
    return ZONE_DEFINITIONS[selectedZoneId] || ZONE_DEFINITIONS.ZONA_2;
  }, [selectedZoneId]);

  // Current Calculation Result
  const currentCalculation = useMemo<CalculationResult>(() => {
    const nominalRate = selectedZone.standardPercent;
    const appliedRate = isPromoSabar ? selectedZone.promoSabarPercent : selectedZone.standardPercent;

    const biayaSelisih = Math.round(hargaBarang * (appliedRate / 100));
    const biayaSelisihNormal = Math.round(hargaBarang * (nominalRate / 100));
    const hematDiskon = Math.max(0, biayaSelisihNormal - biayaSelisih);
    const totalTransaksi = hargaBarang + biayaSelisih;

    return {
      hargaBarang,
      selectedZone,
      isPromoSabar,
      nominalRatePercent: nominalRate,
      appliedRatePercent: appliedRate,
      biayaSelisih,
      biayaSelisihNormal,
      hematDiskon,
      totalTransaksi,
    };
  }, [hargaBarang, selectedZone, isPromoSabar]);

  // Record an item to history
  const recordCalculation = useCallback((customData?: {
    orderNo?: string;
    customerName?: string;
    notes?: string;
  }) => {
    const now = new Date();
    const dateKey = formatDateKey(now);
    const timeFormatted = formatHumanTime(now);
    const dateFormatted = formatHumanDate(now);

    const newItem: HistoryItem = {
      id: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.getTime(),
      dateKey,
      timeFormatted,
      dateFormatted,
      orderNo: (customData?.orderNo || orderNo).trim() || undefined,
      customerName: (customData?.customerName || customerName).trim() || undefined,
      notes: (customData?.notes || notes).trim() || undefined,
      hargaBarang: currentCalculation.hargaBarang,
      zoneId: currentCalculation.selectedZone.id,
      zoneName: currentCalculation.selectedZone.name,
      isPromoSabar: currentCalculation.isPromoSabar,
      nominalRate: currentCalculation.nominalRatePercent,
      appliedRate: currentCalculation.appliedRatePercent,
      biayaSelisih: currentCalculation.biayaSelisih,
      hematDiskon: currentCalculation.hematDiskon,
      totalTransaksi: currentCalculation.totalTransaksi,
    };

    setHistory(prev => [newItem, ...prev]);
    setCounterCount(prev => prev + 1);

    return newItem;
  }, [currentCalculation, orderNo, customerName, notes]);

  // Delete an item
  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Reset to initial sample
  const resetToSampleData = useCallback(() => {
    const samples = getInitialSampleHistory();
    setHistory(samples);
    setCounterCount(samples.length + 8);
  }, []);

  // Aggregated Counter Stats
  const counterStats = useMemo<CounterStats>(() => {
    const todayKey = formatDateKey();
    
    let totalTransactionVolume = 0;
    let todayTransactionVolume = 0;
    let totalSelisihCollected = 0;
    let todaySelisihCollected = 0;
    let totalSavingsGiven = 0;
    let todaySavingsGiven = 0;
    let todayCalculations = 0;

    history.forEach(item => {
      totalTransactionVolume += item.totalTransaksi;
      totalSelisihCollected += item.biayaSelisih;
      totalSavingsGiven += item.hematDiskon;

      if (item.dateKey === todayKey) {
        todayCalculations += 1;
        todayTransactionVolume += item.totalTransaksi;
        todaySelisihCollected += item.biayaSelisih;
        todaySavingsGiven += item.hematDiskon;
      }
    });

    return {
      totalCalculations: Math.max(counterCount, history.length),
      todayCalculations,
      totalTransactionVolume,
      todayTransactionVolume,
      totalSelisihCollected,
      todaySelisihCollected,
      totalSavingsGiven,
      todaySavingsGiven,
    };
  }, [history, counterCount]);

  // Aggregated Daily Summaries for monitoring table
  const dailySummaries = useMemo<DailySummary[]>(() => {
    const groups: Record<string, DailySummary> = {};

    history.forEach(item => {
      if (!groups[item.dateKey]) {
        groups[item.dateKey] = {
          dateKey: item.dateKey,
          dateLabel: item.dateFormatted,
          count: 0,
          totalHargaBarang: 0,
          totalBiayaSelisih: 0,
          totalTransaksi: 0,
          totalHematPromo: 0,
          promoSabarCount: 0,
          regulerCount: 0,
        };
      }

      const g = groups[item.dateKey];
      g.count += 1;
      g.totalHargaBarang += item.hargaBarang;
      g.totalBiayaSelisih += item.biayaSelisih;
      g.totalTransaksi += item.totalTransaksi;
      g.totalHematPromo += item.hematDiskon;
      if (item.isPromoSabar) {
        g.promoSabarCount += 1;
      } else {
        g.regulerCount += 1;
      }
    });

    return Object.values(groups).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [history]);

  return {
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
    autoSaveEnabled,
    setAutoSaveEnabled,
    currentCalculation,
    recordCalculation,
    history,
    deleteHistoryItem,
    clearHistory,
    resetToSampleData,
    counterStats,
    dailySummaries,
  };
}
