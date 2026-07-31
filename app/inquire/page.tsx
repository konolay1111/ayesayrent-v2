import { redirect } from "next/navigation";

type InquireRedirectPageProps = {
  searchParams: Promise<{
    propertyId?: string;
  }>;
};

export default async function InquireRedirectPage({
  searchParams,
}: InquireRedirectPageProps) {
  const { propertyId = "" } = await searchParams;
  const trimmedPropertyId = propertyId.trim();

  if (trimmedPropertyId) {
    redirect(
      `/shortlist?add=${encodeURIComponent(trimmedPropertyId)}`,
    );
  }

  redirect("/shortlist");
}
