import type { Brand } from "@/domain/entities/Brand";
import type { BrandRepository } from "@/domain/repositories/BrandRepository";

/** 5 brand contoh. Tambah brand di sini + slug-nya di brandApiSlugs. */
export const FEATURED_BRANDS: Brand[] = [
  { id: "samsung", name: "Samsung", tagline: "Galaxy untuk semua", accentColor: "#1428a0" },
  { id: "apple", name: "Apple", tagline: "iPhone terbaru", accentColor: "#111827" },
  { id: "xiaomi", name: "Xiaomi", tagline: "Xiaomi, Redmi & POCO", accentColor: "#ff6900" },
  { id: "oppo", name: "OPPO", tagline: "Find, Reno & A series", accentColor: "#0a7d4d" },
  { id: "vivo", name: "vivo", tagline: "X, V & Y series", accentColor: "#415fff" },
  { id: "infinix", name: "Infinix", tagline: "Infinix, Zero & Hot series", accentColor: "#780606" },
];

/** Slug brand di Phone Specs API (lihat /brands). */
export const brandApiSlugs: Record<string, string> = {
  samsung: "samsung-phones-9",
  apple: "apple-phones-48",
  xiaomi: "xiaomi-phones-80",
  oppo: "oppo-phones-82",
  vivo: "vivo-phones-98",
  infinix: "infinix-phones-119",
};

export class StaticBrandRepository implements BrandRepository {
  async getFeatured() {
    return FEATURED_BRANDS;
  }

  async getById(id: string) {
    return FEATURED_BRANDS.find((b) => b.id === id) ?? null;
  }
}
