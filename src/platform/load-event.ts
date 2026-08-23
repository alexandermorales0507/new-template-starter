// PLATFORM CORE — DO NOT MODIFY FOR VISUAL DESIGN.

import { getPublicEnv, type PublicEnv } from "./env";
import { getPreviewContext, appendPrivateAccessToken, type PreviewQuery } from "./preview-context";
import { normalizeEvent } from "./normalize-event";
import { validatePublicEventContract } from "./contract";
import { DEMO_EVENT_DATA } from "./demo-event";
import type { EventTemplateData } from "./event-template-data";

export type EventLoadResult =
  | { status: "available"; data: EventTemplateData; env: PublicEnv }
  | { status: "unavailable"; code?: string; message: string; env: PublicEnv }
  | { status: "setup_error"; message: string; env: PublicEnv }
  | { status: "network_error"; message: string; env: PublicEnv }
  | { status: "malformed_response"; message: string; env: PublicEnv };

export async function loadEvent(query?: PreviewQuery): Promise<EventLoadResult> {
  const env = getPublicEnv();
  const context = getPreviewContext(env, query);

  // Intentional Demo Mode
  if (env.designMode) {
    return {
      status: "available",
      data: DEMO_EVENT_DATA,
      env,
    };
  }

  // Connected Mode Validation
  if (!env.apiBaseUrl || !context.eventSlug) {
    return {
      status: "setup_error",
      message: "Missing NEXT_PUBLIC_WEBSERBISYO_API_URL or NEXT_PUBLIC_EVENT_SLUG configuration.",
      env,
    };
  }

  if (context.previewMode === "dashboard" && !context.previewToken) {
    return {
      status: "unavailable",
      code: "preview_access_required",
      message: "Draft preview access is missing or expired.",
      env,
    };
  }

  try {
    const cleanBase = env.apiBaseUrl.replace(/\/+$/, "");
    const publicEndpoint = `${cleanBase}/api/public/events/${encodeURIComponent(context.eventSlug)}`;
    const publicUrl =
      appendPrivateAccessToken(publicEndpoint, context.accessToken) ?? publicEndpoint;

    const draftPreviewUrl = new URL(
      `${cleanBase}/api/dashboard/event/preview/${encodeURIComponent(context.eventSlug)}`
    );
    if (typeof context.revision === "number") {
      draftPreviewUrl.searchParams.set("revision", String(context.revision));
    }

    const requestUrl = context.previewMode === "dashboard" ? draftPreviewUrl.toString() : publicUrl;

    const response = await fetch(requestUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(context.previewMode === "dashboard" && context.previewToken
          ? { Authorization: `Bearer ${context.previewToken}` }
          : {}),
      },
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const err =
        payload && typeof payload === "object" && "error" in payload
          ? (payload as { error: { code?: string; message?: string } }).error
          : undefined;

      return {
        status: "unavailable",
        code: err?.code,
        message: err?.message ?? "This event website is currently unavailable.",
        env,
      };
    }

    if (!payload || typeof payload !== "object" || !("data" in payload)) {
      return {
        status: "malformed_response",
        message: "The WebSerbisyo API returned an unexpected response format.",
        env,
      };
    }

    const rawData = (payload as { data: Record<string, unknown> }).data;

    if (!validatePublicEventContract(rawData)) {
      return {
        status: "malformed_response",
        message: "The event website data contract version is not supported.",
        env,
      };
    }

    const normalized = normalizeEvent({
      raw: rawData,
      source: context.previewMode === "dashboard" ? "snapshot" : "live",
      previewMode: context.previewMode,
      eventSlug: context.eventSlug,
    });

    return {
      status: "available",
      data: normalized,
      env,
    };
  } catch (err) {
    return {
      status: "network_error",
      message: err instanceof Error ? err.message : "Could not reach the WebSerbisyo API.",
      env,
    };
  }
}
