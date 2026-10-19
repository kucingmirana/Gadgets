import type { Brand } from "@/domain/entities/Brand";
import type { BrandCatalog, PhoneSummary } from "@/domain/entities/Phone";
import type { BrandRepository } from "@/domain/repositories/BrandRepository";
import type { PhonePage, PhoneRepository } from "@/domain/repositories/PhoneRepository";

/** Batas aman jumlah halaman API yang diambil per brand. */
const MAX_PAGES = 30;
/** Jumlah request halaman yang berjalan bersamaan. */
const CONCURRENCY = 5;

/**
 * Use case: ambil SEMUA halaman HP milik brand lalu gabungkan jadi satu daftar,
 * supaya filter (mis. series) bekerja di seluruh data, bukan hanya satu halaman.
 */
export class GetAllBrandPhones {
  constructor(private readonly brands: BrandRepository, private readonly phones: PhoneRepository) {}

  async execute(brandId: string): Promise<BrandCatalog | null> {
    const brand = await this.brands.getById(brandId);
    if (!brand) return null;

    const first = await this.phones.getLatestByBrand(brand, 1);
    // Data cadangan hanya satu halaman: tidak ada yang perlu digabung
    if (first.source === "fallback") return { brand, ...first };

    const pages: PhonePage[] = [first];
    let lastPage = Math.min(first.totalPages, MAX_PAGES);
    for (let next = 2; next <= lastPage; next += CONCURRENCY) {
      const batch = await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, lastPage - next + 1) }, (_, i) => this.fetchPage(brand, next + i))
      );
      const live = batch.filter((p): p is PhonePage => p !== null);
      pages.push(...live);
      // `last_page` dari API bisa bertambah saat halaman berikutnya dibaca
      lastPage = Math.min(Math.max(lastPage, ...live.map((p) => p.totalPages)), MAX_PAGES);
    }

    const phones = dedupe(pages.sort((a, b) => a.page - b.page).flatMap((p) => p.phones));
    return { brand, phones, source: "live", page: 1, totalPages: 1 };
  }

  /** Halaman yang gagal / jatuh ke data cadangan dilewati agar data contoh tidak tercampur. */
  private async fetchPage(brand: Brand, page: number): Promise<PhonePage | null> {
    try {
      const res = await this.phones.getLatestByBrand(brand, page);
      return res.source === "live" ? res : null;
    } catch {
      return null;
    }
  }
}

function dedupe(phones: PhoneSummary[]): PhoneSummary[] {
  const seen = new Set<string>();
  return phones.filter((p) => {
    const key = p.id || `${p.brandName}-${p.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
