import type { PhoneDetail } from "@/domain/entities/Phone";
import type { PhoneRepository } from "@/domain/repositories/PhoneRepository";

export class GetPhoneDetail {
  constructor(private readonly phones: PhoneRepository) {}

  async execute(id: string): Promise<PhoneDetail | null> {
    if (!/^[a-z0-9_-]+$/i.test(id)) return null; // validasi input
    return this.phones.getDetail(id);
  }
}
