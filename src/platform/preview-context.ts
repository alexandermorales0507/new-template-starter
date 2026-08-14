// PLATFORM CORE — DO NOT MODIFY FOR VISUAL DESIGN.

import type { PublicEnv } from "./env";

export type PreviewQuery = Record<string, string | string[] | undefined>;

export type PreviewContext = {
  accessToken?: string;
  eventSlug: string;
  previewMode?: "dashboard";
  previewToken?: string;
  revision?: number;
  querySource?: string;
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "").trim() : (value ?? "").trim();
}

function safeSlug(value: string): string {
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(value) ? value : "";
}

function safeSource(value: string): string | undefined {
  const clean = value.toLowerCase();
  return /^[a-z0-9_-]{1,40}$/.test(clean) ? clean : undefined;
}

function safePreviewToken(value: string): string | undefined {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value) ? value : undefined;
}

export function normalizePrivateAccessToken(value?: string | null): string | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  return /^[A-Za-z0-9_-]{20,256}$/.test(trimmed) ? trimmed : null;
}

export function appendPrivateAccessToken(
  url?: string | null,
  token?: string | null
): string | null {
  const normalizedUrl = url?.trim() ?? "";
  const normalizedToken = normalizePrivateAccessToken(token);
  if (!normalizedUrl) return null;
  if (!normalizedToken) return normalizedUrl;

  const isAbsoluteUrl = /^[a-z][a-z\d+\-.]*:\/\//i.test(normalizedUrl);
  const parsed = new URL(normalizedUrl, "https://webserbisyo.local");
  parsed.searchParams.set("access", normalizedToken);
  if (isAbsoluteUrl) {
    return parsed.toString();
  }
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function getPreviewContext(env: PublicEnv, query?: PreviewQuery): PreviewContext {
  const preview = firstValue(query?.preview).toLowerCase();
  const accessToken = normalizePrivateAccessToken(firstValue(query?.access));
  const querySource = safeSource(firstValue(query?.source));
  const dashboardPreview = preview === "dashboard" || querySource === "dashboard";
  const previewToken = safePreviewToken(firstValue(query?.previewToken));
  const revisionValue = Number(firstValue(query?.revision));
  const querySlug = safeSlug(firstValue(query?.eventSlug));
  const canUseQuerySlug = Boolean(
    querySlug && (dashboardPreview || env.designMode || process.env.NODE_ENV === "development")
  );

  return {
    accessToken: accessToken ?? undefined,
    eventSlug: canUseQuerySlug ? querySlug : env.eventSlug,
    previewMode: dashboardPreview ? "dashboard" : undefined,
    previewToken: dashboardPreview ? previewToken : undefined,
    revision:
      dashboardPreview && Number.isSafeInteger(revisionValue) && revisionValue >= 0
        ? revisionValue
        : undefined,
    querySource,
  };
}
