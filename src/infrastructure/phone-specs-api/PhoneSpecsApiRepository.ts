import type { Brand } from "@/domain/entities/Brand";
import type { PhoneRepository } from "@/domain/repositories/PhoneRepository";
import type { HttpClient } from "../http/HttpClient";
import type { ApiResponse, BrandPhonesDTO, PhoneDetailDTO } from "./dto";
import { toPhoneDetail, toPhoneSummary } from "./mappers";

/** Adapter ke Phone Specs API. Melempar error bila gagal — penanganan ada di decorator. */
export class PhoneSpecsApiRepository implements PhoneRepository {
  constructor(
    private readonly http: HttpClient,
    private readonly baseUrl: string,
    /** Peta id brand domain → slug brand di API */
    private readonly brandSlugs: Record<string, string>
  ) {}

  async getLatestByBrand(brand: Brand, page: number = 1) {
    const slug = this.brandSlugs[brand.id];
    if (!slug) throw new Error(`Slug API untuk brand "${brand.id}" belum diatur`);
    const res = await this.http.getJSON<ApiResponse<BrandPhonesDTO>>(`${this.baseUrl}/brands/${slug}?page=${page}`);
    if (!res.status || !res.data?.phones?.length) throw new Error("Respons kosong");
    return {
      phones: res.data.phones.map(toPhoneSummary),
      source: "live" as const,
      page: res.data.current_page || page,
      totalPages: Math.max(1, res.data.last_page || 1),
    };
  }

  async getDetail(id: string) {
    const res = await this.http.getJSON<ApiResponse<PhoneDetailDTO>>(`${this.baseUrl}/${id}`);
    return res.status && res.data ? toPhoneDetail(id, res.data) : null;
  }
}
