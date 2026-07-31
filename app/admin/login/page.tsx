import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

const NO_ACCESS_MESSAGE =
  "ဤအကောင့်တွင် အက်ဒမင် ခွင့်ပြုချက် မရှိပါ။ This account has no access.";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const initialError =
    params.error === "no_access" ? NO_ACCESS_MESSAGE : null;

  return <AdminLoginForm initialError={initialError} />;
}
