import type { PhoneSummary } from "../entities/Phone";

/** Aturan bisnis pencarian: cocokkan nama brand + model, tidak peka huruf besar/kecil. */
export function searchPhones(phones: PhoneSummary[], query: string): PhoneSummary[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return phones;
  return phones.filter((p) => {
    const haystack = `${p.brandName} ${p.name}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

/** N model teratas dianggap "baru" karena API mengurutkan dari yang terbaru. */
export const NEW_BADGE_COUNT = 3;
