"use server";

import { useCases } from "@/di/container";

/** Server action: ambil seluruh HP brand (semua halaman API digabung) untuk difilter di klien. */
export async function loadAllBrandPhones(brandId: string) {
  return useCases.getAllBrandPhones.execute(brandId);
}
