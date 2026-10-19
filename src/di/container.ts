import "server-only";
import { GetAllBrandPhones } from "@/application/use-cases/GetAllBrandPhones";
import { GetFeaturedCatalogs } from "@/application/use-cases/GetFeaturedCatalogs";
import { GetPhoneDetail } from "@/application/use-cases/GetPhoneDetail";
import { StaticBrandRepository, brandApiSlugs } from "@/infrastructure/brands/StaticBrandRepository";
import { FallbackPhoneRepository } from "@/infrastructure/fallback/FallbackPhoneRepository";
import { FetchHttpClient } from "@/infrastructure/http/HttpClient";
import { PhoneSpecsApiRepository } from "@/infrastructure/phone-specs-api/PhoneSpecsApiRepository";
import { ResilientPhoneRepository } from "@/infrastructure/repositories/ResilientPhoneRepository";

/** Composition root: satu-satunya tempat yang merakit implementasi konkret. */
const API_BASE = process.env.PHONE_API_BASE ?? "https://phone-specs-api.vercel.app";

const brandRepository = new StaticBrandRepository();
const phoneRepository = new ResilientPhoneRepository(
  new PhoneSpecsApiRepository(new FetchHttpClient(3600), API_BASE, brandApiSlugs),
  new FallbackPhoneRepository()
);

export const useCases = {
  getFeaturedCatalogs: new GetFeaturedCatalogs(brandRepository, phoneRepository),
  getAllBrandPhones: new GetAllBrandPhones(brandRepository, phoneRepository),
  getPhoneDetail: new GetPhoneDetail(phoneRepository),
};
