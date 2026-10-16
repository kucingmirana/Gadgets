import type { Brand } from "./Brand";

export interface PhoneSummary {
  id: string; // null-safe: kosong berarti tidak punya halaman detail
  brandName: string;
  name: string;
  imageUrl: string | null;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface SpecGroup {
  title: string;
  items: SpecItem[];
}

export interface PhoneDetail {
  id: string;
  brandName: string;
  name: string;
  thumbnailUrl: string | null;
  galleryUrls: string[];
  releaseDate: string;
  dimension: string;
  os: string;
  storage: string;
  specGroups: SpecGroup[];
}

export type DataSource = "live" | "fallback";

/** Agregat: satu brand beserta satu halaman daftar HP terbarunya. */
export interface BrandCatalog {
  brand: Brand;
  phones: PhoneSummary[];
  source: DataSource;
  page: number;
  totalPages: number;
}

export const hasDetailPage = (p: PhoneSummary) => p.id.length > 0;
