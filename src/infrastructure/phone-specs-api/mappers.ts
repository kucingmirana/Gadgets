import type { PhoneDetail, PhoneSummary } from "@/domain/entities/Phone";
import type { PhoneDetailDTO, PhoneListItemDTO } from "./dto";

/** DTO → Entitas domain. Satu-satunya tempat yang tahu nama field API. */
export const toPhoneSummary = (dto: PhoneListItemDTO): PhoneSummary => ({
  id: dto.slug ?? "",
  brandName: dto.brand,
  name: dto.phone_name,
  imageUrl: dto.image || null,
});

export const toPhoneDetail = (id: string, dto: PhoneDetailDTO): PhoneDetail => ({
  id,
  brandName: dto.brand,
  name: dto.phone_name,
  thumbnailUrl: dto.thumbnail || null,
  galleryUrls: dto.phone_images ?? [],
  releaseDate: dto.release_date ?? "",
  dimension: dto.dimension ?? "",
  os: dto.os ?? "",
  storage: dto.storage ?? "",
  specGroups: (dto.specifications ?? []).map((g) => ({
    title: g.title,
    items: g.specs.map((s) => ({ label: s.key, value: s.val.join(", ") })),
  })),
});
