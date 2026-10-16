// Bentuk respons mentah dari https://github.com/azharimm/phone-specs-api

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

export interface PhoneListItemDTO {
  brand: string;
  phone_name: string;
  slug: string;
  image: string;
  detail: string;
}

export interface BrandPhonesDTO {
  title: string;
  current_page: number;
  last_page: number;
  phones: PhoneListItemDTO[];
}

export interface PhoneDetailDTO {
  brand: string;
  phone_name: string;
  thumbnail: string;
  phone_images: string[];
  release_date: string;
  dimension: string;
  os: string;
  storage: string;
  specifications: { title: string; specs: { key: string; val: string[] }[] }[];
}
