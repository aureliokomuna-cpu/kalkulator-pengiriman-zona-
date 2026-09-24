import { CalculationResult, HistoryItem } from '../types/zone';

export function formatRupiah(amount: number, withPrefix = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return withPrefix ? 'Rp 0' : '0';
  }
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

  return withPrefix ? `Rp ${formatted}` : formatted;
}

export function parseRupiahInput(value: string): number {
  const cleanNumber = value.replace(/[^0-9]/g, '');
  if (!cleanNumber) return 0;
  return parseInt(cleanNumber, 10);
}

export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatHumanDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatHumanTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function generateReceiptText(item: {
  orderNo?: string;
  customerName?: string;
  notes?: string;
  hargaBarang: number;
  zoneName: string;
  isPromoSabar: boolean;
  nominalRate: number;
  appliedRate: number;
  biayaSelisih: number;
  hematDiskon: number;
  totalTransaksi: number;
  timestamp?: number;
}): string {
  const dateStr = item.timestamp 
    ? `${formatHumanDate(new Date(item.timestamp))} ${formatHumanTime(new Date(item.timestamp))}` 
    : `${formatHumanDate()} ${formatHumanTime()}`;

  const header = `📦 *RINCIAN PERHITUNGAN BIAYA TRANSAKSI & ZONA*`;
  const divider = `──────────────────────────────`;
  
  let orderInfo = '';
  if (item.orderNo) orderInfo += `\n*No. Order:* ${item.orderNo}`;
  if (item.customerName) orderInfo += `\n*Customer:* ${item.customerName}`;
  orderInfo += `\n*Waktu:* ${dateStr}`;

  const promoInfo = item.isPromoSabar 
    ? `✨ *PROMO SABAR AKTIF* (Diskon Selisih 5%)` 
    : `🏷️ Tarif Reguler`;

  let costDetails = `
*Harga Barang:* ${formatRupiah(item.hargaBarang)}
*Wilayah:* ${item.zoneName}
*Status Tarif:* ${promoInfo}
*Tiering Rate:* ${item.appliedRate}% ${item.isPromoSabar && item.nominalRate !== item.appliedRate ? `(Normal: ${item.nominalRate}%)` : ''}
*Biaya Selisih Zona:* ${item.biayaSelisih === 0 ? 'GRATIS (FREE)' : formatRupiah(item.biayaSelisih)}`;

  if (item.isPromoSabar && item.hematDiskon > 0) {
    costDetails += `\n*Total Hemat (Promo Sabar):* ${formatRupiah(item.hematDiskon)}`;
  }

  const total = `
${divider}
*TOTAL PEMBAYARAN: ${formatRupiah(item.totalTransaksi)}*
${divider}`;

  let noteSection = '';
  if (item.notes) {
    noteSection = `\n_Catatan: ${item.notes}_\n`;
  }

  const footer = `\n_Terima kasih telah berbelanja dengan kami._`;

  return `${header}${orderInfo}\n${divider}${costDetails}${total}${noteSection}${footer}`;
}

export function exportHistoryToCSV(history: HistoryItem[]): void {
  if (!history.length) return;

  const headers = [
    'ID Transaksi',
    'Tanggal',
    'Jam',
    'No Order',
    'Customer',
    'Harga Barang (Rp)',
    'Zona',
    'Promo Sabar',
    'Rate Normal (%)',
    'Rate Digunakan (%)',
    'Biaya Selisih (Rp)',
    'Hemat Promo (Rp)',
    'Total Transaksi (Rp)',
    'Catatan'
  ];

  const rows = history.map(item => [
    `"${item.id}"`,
    `"${item.dateFormatted}"`,
    `"${item.timeFormatted}"`,
    `"${(item.orderNo || '-').replace(/"/g, '""')}"`,
    `"${(item.customerName || '-').replace(/"/g, '""')}"`,
    item.hargaBarang,
    `"${item.zoneName}"`,
    item.isPromoSabar ? 'Ya' : 'Tidak',
    item.nominalRate,
    item.appliedRate,
    item.biayaSelisih,
    item.hematDiskon,
    item.totalTransaksi,
    `"${(item.notes || '-').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `rekap_perhitungan_zona_${formatDateKey()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
