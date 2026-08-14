// PLATFORM ACTION — KEEP SUBMISSION THROUGH SHARED ADAPTER.

import { appendPrivateAccessToken } from "./preview-context";

export type PublicRsvpPayload = {
  guestName: string;
  attendanceStatus: "attending" | "not_attending";
  email?: string;
  phone?: string;
  companionCount?: number;
  companions?: Array<{
    fullName?: string;
    ageLabel?: string;
  }>;
  dietaryNotes?: string;
  message?: string;
};

export type PublicRsvpSubmitResult =
  | {
      data: {
        responseId: string;
        submittedAt: string;
      };
      error?: never;
    }
  | {
      data?: never;
      error: {
        code?: string;
        message?: string;
        fieldErrors?: Record<string, string[]>;
      };
    };

export type SubmitRsvpOptions = {
  eventSlug: string;
  payload: PublicRsvpPayload;
  apiBaseUrl?: string;
  accessToken?: string | null;
  isDemoMode?: boolean;
};

export async function submitRsvp({
  eventSlug,
  payload,
  apiBaseUrl,
  accessToken,
  isDemoMode,
}: SubmitRsvpOptions): Promise<PublicRsvpSubmitResult> {
  // In demo/design mode, simulate success response without hitting backend
  if (isDemoMode) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      data: {
        responseId: `demo-rsvp-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      },
    };
  }

  const cleanBase = (apiBaseUrl ?? "").replace(/\/+$/, "");
  const endpoint = `${cleanBase}/api/public/events/${encodeURIComponent(eventSlug)}/rsvp`;
  const requestUrl = appendPrivateAccessToken(endpoint, accessToken) ?? endpoint;

  try {
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...payload,
        ...(accessToken ? { accessToken } : {}),
      }),
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        error: json?.error || {
          message: "An unexpected error occurred while submitting your RSVP.",
        },
      };
    }

    return {
      data: json.data || {
        responseId: `resp-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      },
    };
  } catch {
    return {
      error: {
        message: "Network error. Please check your connection and try again.",
      },
    };
  }
}
