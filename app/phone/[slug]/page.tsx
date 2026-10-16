import { notFound } from "next/navigation";
import { cache } from "react";
import { useCases } from "@/di/container";
import { PhoneDetailView } from "@/presentation/components/PhoneDetailView";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

// Dedup request antara generateMetadata & page
const loadPhone = cache((slug: string) => useCases.getPhoneDetail.execute(slug));

export async function generateMetadata({ params }: Props) {
  const phone = await loadPhone((await params).slug);
  return { title: phone ? `${phone.name} — PhoneHub` : "HP tidak ditemukan" };
}

export default async function PhonePage({ params }: Props) {
  const phone = await loadPhone((await params).slug);
  if (!phone) notFound();
  return <PhoneDetailView phone={phone} />;
}
