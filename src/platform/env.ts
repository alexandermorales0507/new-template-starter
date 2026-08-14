// PLATFORM CORE — DO NOT MODIFY FOR VISUAL DESIGN.

export type PublicEnv = {
  apiBaseUrl: string;
  eventSlug: string;
  designMode: boolean;
  explicitDesignMode: boolean;
  templateId: string;
  hasLiveConfig: boolean;
};

function cleanUrl(value?: string): string {
  return (value ?? "").trim().replace(/\/+$/, "");
}

function asBoolean(value?: string): boolean {
  return (
    String(value ?? "")
      .trim()
      .toLowerCase() === "true"
  );
}

export function getPublicEnv(): PublicEnv {
  const apiBaseUrl = cleanUrl(process.env.NEXT_PUBLIC_WEBSERBISYO_API_URL);
  const eventSlug = (process.env.NEXT_PUBLIC_EVENT_SLUG ?? "").trim();
  const rawDesignMode = process.env.NEXT_PUBLIC_DESIGN_MODE;
  const explicitDesignMode = rawDesignMode != null && rawDesignMode.trim().length > 0;
  const hasLiveConfig = Boolean(apiBaseUrl && eventSlug);
  const designMode = explicitDesignMode ? asBoolean(rawDesignMode) : !hasLiveConfig;

  return {
    apiBaseUrl,
    eventSlug,
    designMode,
    explicitDesignMode,
    templateId: (process.env.NEXT_PUBLIC_TEMPLATE_ID ?? "wedding-custom-starter-v2").trim(),
    hasLiveConfig,
  };
}
