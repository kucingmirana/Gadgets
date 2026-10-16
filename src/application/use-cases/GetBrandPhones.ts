import type { BrandCatalog } from "@/domain/entities/Phone";
import type { BrandRepository } from "@/domain/repositories/BrandRepository";
import type { PhoneRepository } from "@/domain/repositories/PhoneRepository";

/** Use case: ambil satu halaman HP milik brand tertentu. */
export class GetBrandPhones {
  constructor(private readonly brands: BrandRepository, private readonly phones: PhoneRepository) {}

  async execute(brandId: string, page: number): Promise<BrandCatalog | null> {
    if (!Number.isInteger(page) || page < 1) return null; // validasi input
    const brand = await this.brands.getById(brandId);
    if (!brand) return null;
    return { brand, ...(await this.phones.getLatestByBrand(brand, page)) };
  }
}
