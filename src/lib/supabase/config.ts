export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const configuredSiteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabasePublishableKey.length > 0;

function normalizeSiteUrl(value: string | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue || trimmedValue === "CHANGE_ME") {
    return "";
  }

  const url = trimmedValue.startsWith("http")
    ? trimmedValue
    : `https://${trimmedValue}`;

  return url.replace(/\/+$/, "");
}

export function getAdminRedirectUrl(origin: string) {
  const baseUrl = configuredSiteUrl || origin.replace(/\/+$/, "");

  return `${baseUrl}/admin`;
}
