"use server";

import { useCases } from "@/di/container";

/** Server action: ambil satu halaman HP brand (dipanggil saat pindah halaman). */
export async function loadBrandPage(brandId: string, page: number) {
  return useCases.getBrandPhones.execute(brandId, page);
}
