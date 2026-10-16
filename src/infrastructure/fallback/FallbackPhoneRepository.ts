import type { Brand } from "@/domain/entities/Brand";
import type { PhoneSummary } from "@/domain/entities/Phone";
import type { PhoneRepository } from "@/domain/repositories/PhoneRepository";

// Data cadangan statis (tanpa gambar & detail) agar UI tetap tampil saat API down.
const SAMPLE: Record<string, string[]> = {
  samsung: ["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25", "Galaxy Z Fold7", "Galaxy Z Flip7", "Galaxy A56", "Galaxy A36", "Galaxy A26"],
  apple: ["iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone Air", "iPhone 17", "iPhone 16e", "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16"],
  xiaomi: ["Xiaomi 15 Ultra", "Xiaomi 15", "Xiaomi 15T Pro", "Redmi Note 14 Pro+", "Redmi Note 14", "POCO F7 Pro", "POCO X7 Pro", "Redmi 15"],
  oppo: ["Find X8 Ultra", "Find X8 Pro", "Find N5", "Reno14 Pro", "Reno14", "A5 Pro", "A5", "K13"],
  vivo: ["X200 Ultra", "X200 Pro", "X Fold5", "V60", "V50", "Y29", "T4 Ultra", "Y19s"],
};

export class FallbackPhoneRepository implements PhoneRepository {
  /** Data cadangan hanya satu halaman, berapa pun `page` yang diminta. */
  async getLatestByBrand(brand: Brand) {
    const phones: PhoneSummary[] = (SAMPLE[brand.id] ?? []).map((name) => ({
      id: "",
      brandName: brand.name,
      name,
      imageUrl: null,
    }));
    return { phones, source: "fallback" as const, page: 1, totalPages: 1 };
  }

  async getDetail() {
    return null;
  }
}
