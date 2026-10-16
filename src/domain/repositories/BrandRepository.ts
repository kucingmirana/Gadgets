import type { Brand } from "../entities/Brand";

export interface BrandRepository {
  getFeatured(): Promise<Brand[]>;
  getById(id: string): Promise<Brand | null>;
}
