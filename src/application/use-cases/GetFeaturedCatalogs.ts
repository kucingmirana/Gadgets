import type { BrandCatalog } from "@/domain/entities/Phone";
import type { BrandRepository } from "@/domain/repositories/BrandRepository";
import type { PhoneRepository } from "@/domain/repositories/PhoneRepository";

/** Use case: ambil brand unggulan + halaman pertama HP terbarunya, secara paralel. */
export class GetFeaturedCatalogs {
  constructor(private readonly brands: BrandRepository, private readonly phones: PhoneRepository) {}

  async execute(): Promise<BrandCatalog[]> {
    const brands = await this.brands.getFeatured();
    return Promise.all(
      brands.map(async (brand) => ({ brand, ...(await this.phones.getLatestByBrand(brand, 1)) }))
    );
  }
}
