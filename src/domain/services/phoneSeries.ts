import type { PhoneSummary } from "../entities/Phone";

export interface PhoneSeries {
  id: string;
  label: string;
  pattern: RegExp;
}

/** Series yang tidak cocok dengan pola mana pun. */
export const OTHER_SERIES: Omit<PhoneSeries, "pattern"> = { id: "other", label: "Lainnya" };

/**
 * Aturan series per brand (key = Brand.id). Urutan penting: pola pertama yang cocok menang,
 * jadi tablet/jam tangan ditaruh lebih dulu agar "Galaxy Tab S9" tidak masuk S series.
 * Pola dicocokkan ke nama model (tanpa nama brand), tidak peka huruf besar/kecil.
 */
const SERIES_BY_BRAND: Record<string, PhoneSeries[]> = {
  samsung: [
    { id: "tab", label: "Galaxy Tab", pattern: /^galaxy tab\b/i },
    { id: "watch", label: "Galaxy Watch", pattern: /^galaxy watch/i },
    { id: "s", label: "S Series", pattern: /^galaxy s\d/i },
    { id: "z", label: "Z Series", pattern: /^galaxy z\b/i },
    { id: "a", label: "A Series", pattern: /^galaxy a\d/i },
    { id: "m", label: "M Series", pattern: /^galaxy m\d/i },
    { id: "f", label: "F Series", pattern: /^galaxy f\d/i },
    { id: "xcover", label: "XCover", pattern: /^galaxy xcover/i },
  ],
  apple: [
    { id: "iphone", label: "iPhone", pattern: /^iphone\b/i },
    { id: "ipad", label: "iPad", pattern: /^ipad\b/i },
    { id: "watch", label: "Apple Watch", pattern: /^watch\b/i },
  ],
  xiaomi: [
    { id: "pad", label: "Pad", pattern: /\bpad\b/i },
    { id: "watch", label: "Watch", pattern: /\bwatch\b/i },
    { id: "redmi-note", label: "Redmi Note", pattern: /^redmi note\b/i },
    { id: "redmi-k", label: "Redmi K", pattern: /^redmi k\d/i },
    { id: "redmi", label: "Redmi", pattern: /^redmi\b/i },
    { id: "poco", label: "POCO", pattern: /^poco\b/i },
    { id: "xiaomi", label: "Xiaomi", pattern: /^(xiaomi )?\d/i },
  ],
  oppo: [
    { id: "pad", label: "Pad", pattern: /^pad\b/i },
    { id: "watch", label: "Watch", pattern: /^watch\b/i },
    { id: "find", label: "Find Series", pattern: /^find\b/i },
    { id: "reno", label: "Reno Series", pattern: /^reno/i },
    { id: "a", label: "A Series", pattern: /^a\d/i },
    { id: "f", label: "F Series", pattern: /^f\d/i },
    { id: "k", label: "K Series", pattern: /^k\d/i },
  ],
  vivo: [
    { id: "pad", label: "Pad", pattern: /pad/i },
    { id: "iqoo", label: "iQOO", pattern: /^iqoo\b/i },
    { id: "x", label: "X Series", pattern: /^x(\d|\s)/i },
    { id: "v", label: "V Series", pattern: /^v\d/i },
    { id: "y", label: "Y Series", pattern: /^y\d/i },
    { id: "t", label: "T Series", pattern: /^t\d/i },
    { id: "s", label: "S Series", pattern: /^s\d/i },
  ],
  infinix: [
    { id: "xpad", label: "Xpad", pattern: /^xpad\b/i },
    { id: "gt", label: "GT Series", pattern: /^gt\b/i },
    { id: "zero", label: "Zero Series", pattern: /^zero\b/i },
    { id: "note", label: "Note Series", pattern: /^note\b/i },
    { id: "hot", label: "Hot Series", pattern: /^hot\b/i },
    { id: "smart", label: "Smart Series", pattern: /^smart\b/i },
  ],
};

/** Tentukan id series sebuah HP; "other" bila tidak ada pola yang cocok. */
export function seriesOf(brandId: string, phone: PhoneSummary): string {
  const name = phone.name.trim();
  return SERIES_BY_BRAND[brandId]?.find((s) => s.pattern.test(name))?.id ?? OTHER_SERIES.id;
}

export interface SeriesCount {
  id: string;
  label: string;
  count: number;
}

/** Daftar series yang muncul di `phones` beserta jumlahnya, urut sesuai definisi brand. */
export function countSeries(brandId: string, phones: PhoneSummary[]): SeriesCount[] {
  const counts = new Map<string, number>();
  for (const p of phones) {
    const id = seriesOf(brandId, p);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...(SERIES_BY_BRAND[brandId] ?? []), OTHER_SERIES]
    .map((s) => ({ id: s.id, label: s.label, count: counts.get(s.id) ?? 0 }))
    .filter((s) => s.count > 0);
}

/** Label series untuk ditampilkan (mis. series terpilih yang kosong di halaman ini). */
export function seriesLabel(brandId: string, seriesId: string): string {
  return SERIES_BY_BRAND[brandId]?.find((s) => s.id === seriesId)?.label ?? OTHER_SERIES.label;
}

export function filterBySeries(brandId: string, phones: PhoneSummary[], seriesId: string | null): PhoneSummary[] {
  if (!seriesId) return phones;
  return phones.filter((p) => seriesOf(brandId, p) === seriesId);
}
