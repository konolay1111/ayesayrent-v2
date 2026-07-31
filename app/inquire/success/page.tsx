import { redirect } from "next/navigation";

type InquireSuccessRedirectPageProps = {
  searchParams: Promise<{
    ref?: string;
    propertyId?: string;
    propertyIds?: string;
    source?: string;
  }>;
};

export default async function InquireSuccessRedirectPage({
  searchParams,
}: InquireSuccessRedirectPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.ref?.trim()) {
    query.set("ref", params.ref.trim());
  }

  const propertyIds =
    params.propertyIds?.trim() ||
    params.propertyId?.trim() ||
    "";

  if (propertyIds) {
    query.set("propertyIds", propertyIds);
  }

  const suffix = query.toString();
  redirect(suffix ? `/shortlist/success?${suffix}` : "/shortlist/success");
}
