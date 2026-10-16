import type { Brand } from "../entities/Brand";
import type { DataSource, PhoneDetail, PhoneSummary } from "../entities/Phone";

/** Satu halaman HP milik brand, beserta info paging dari sumber data. */
export interface PhonePage {
  phones: PhoneSummary[];
  source: DataSource;
  page: number;
  totalPages: number;
}

/** Port (kontrak) yang wajib dipenuhi oleh setiap sumber data HP. */
export interface PhoneRepository {
  /** HP terbaru milik brand pada halaman `page` (mulai 1), urut dari yang paling baru. */
  getLatestByBrand(brand: Brand, page?: number): Promise<PhonePage>;
  getDetail(id: string): Promise<PhoneDetail | null>;
}
