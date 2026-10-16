import type { Brand } from "@/domain/entities/Brand";
import type { PhoneRepository } from "@/domain/repositories/PhoneRepository";

/** Decorator: coba sumber utama, jatuh ke cadangan bila error. */
export class ResilientPhoneRepository implements PhoneRepository {
  constructor(private readonly primary: PhoneRepository, private readonly fallback: PhoneRepository) {}

  async getLatestByBrand(brand: Brand, page: number = 1) {
    try {
      return await this.primary.getLatestByBrand(brand, page);
    } catch (err) {
      console.warn(`[phones] fallback untuk ${brand.name}:`, (err as Error).message);
      return this.fallback.getLatestByBrand(brand, page);
    }
  }

  async getDetail(id: string) {
    try {
      return await this.primary.getDetail(id);
    } catch {
      return this.fallback.getDetail(id);
    }
  }
}
