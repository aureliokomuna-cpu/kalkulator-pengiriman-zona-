export type ZoneId = 'ZONA_1' | 'ZONA_2' | 'ZONA_3' | 'ZONA_4' | 'ZONA_5';

export interface ZoneDefinition {
  id: ZoneId;
  name: string;
  code: string;
  alias?: string;
  standardPercent: number; // e.g. 5 for 5%
  promoSabarPercent: number; // e.g. 0 for FREE
  description: string;
  coverageArea: string;
  cities: string[];
  color: string;
  accentBg: string;
}

export interface CalculationResult {
  hargaBarang: number;
  selectedZone: ZoneDefinition;
  isPromoSabar: boolean;
  nominalRatePercent: number;
  appliedRatePercent: number;
  biayaSelisih: number;
  biayaSelisihNormal: number;
  hematDiskon: number;
  totalTransaksi: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  dateKey: string; // YYYY-MM-DD
  timeFormatted: string; // HH:mm
  dateFormatted: string; // DD MMM YYYY
  orderNo?: string;
  customerName?: string;
  notes?: string;
  hargaBarang: number;
  zoneId: ZoneId;
  zoneName: string;
  isPromoSabar: boolean;
  nominalRate: number;
  appliedRate: number;
  biayaSelisih: number;
  hematDiskon: number;
  totalTransaksi: number;
}

export interface DailySummary {
  dateKey: string;
  dateLabel: string;
  count: number;
  totalHargaBarang: number;
  totalBiayaSelisih: number;
  totalTransaksi: number;
  totalHematPromo: number;
  promoSabarCount: number;
  regulerCount: number;
}

export interface CounterStats {
  totalCalculations: number;
  todayCalculations: number;
  totalTransactionVolume: number;
  todayTransactionVolume: number;
  totalSelisihCollected: number;
  todaySelisihCollected: number;
  totalSavingsGiven: number;
  todaySavingsGiven: number;
}
