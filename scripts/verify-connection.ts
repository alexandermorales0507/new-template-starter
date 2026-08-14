import { getPublicEnv } from "../src/platform/env.js";
import { loadEvent } from "../src/platform/load-event.js";

async function runVerifyConnection() {
  console.log("LIVE WEBSERBISYO CONNECTION CHECK");
  console.log("─────────────────────────────────");

  const env = getPublicEnv();

  if (env.designMode || !env.hasLiveConfig) {
    console.log("SKIPPED — CONNECTED ENVIRONMENT NOT CONFIGURED\n");
    console.log("The starter is currently running in local Design / Demo Mode.");
    console.log("To connect to a live WebSerbisyo event, configure environment variables:\n");
    console.log("  NEXT_PUBLIC_WEBSERBISYO_API_URL=https://api.webserbisyo.com");
    console.log("  NEXT_PUBLIC_EVENT_SLUG=your-actual-event-slug");
    console.log("  NEXT_PUBLIC_DESIGN_MODE=false\n");
    console.log("Optional private access token:");
    console.log("  NEXT_PUBLIC_WEBSERBISYO_ACCESS_TOKEN=your-private-token\n");
    console.log(
      "Note: This connection verifier is strictly READ-ONLY and never submits RSVPs or mutates data."
    );
    process.exit(0);
  }

  console.log(`Connecting to: ${env.apiBaseUrl}`);
  console.log(`Target Event: ${env.eventSlug}`);

  const tokenPresent = Boolean(process.env.NEXT_PUBLIC_WEBSERBISYO_ACCESS_TOKEN);
  console.log(`Private Token: ${tokenPresent ? "Present (redacted)" : "None"}`);

  const result = await loadEvent();

  if (result.status === "available") {
    const data = result.data;
    console.log("\n✓ Platform API reachable");
    console.log(`✓ Event found: "${data.title || data.coupleDisplayName}"`);
    console.log(`✓ Contract version: ${data.contractVersion}`);
    console.log(`✓ Source mode: ${data.source}`);
    console.log(`✓ Couple: ${data.coupleDisplayName}`);
    console.log(`✓ Event Date: ${data.eventDateLabel || "N/A"}`);
    console.log(`✓ RSVP Enabled: ${data.enabledSectionKeys?.includes("rsvp_form") ? "YES" : "NO"}`);

    const enabled = data.enabledSectionKeys || [];
    const ordered = data.orderedSectionKeys || [];
    const disabled = ordered.filter((k) => !enabled.includes(k));

    console.log(`\nEnabled sections (${enabled.length}):`);
    console.log(`  ${enabled.join(", ")}`);

    if (disabled.length > 0) {
      console.log(`\nDisabled sections (${disabled.length}):`);
      console.log(`  ${disabled.join(", ")}`);
    }

    console.log("\nRESULT: ✓ LIVE CONNECTION HEALTHY");
    process.exit(0);
  } else {
    console.log("\n✗ LIVE CONNECTION FAILED");
    console.log(`Status: ${result.status}`);
    if ("code" in result && result.code) {
      console.log(`Error Code: ${result.code}`);
    }
    console.log(`Message: ${result.message}`);
    process.exit(1);
  }
}

runVerifyConnection().catch((err) => {
  console.error("\nUnexpected error during connection verification:", err);
  process.exit(1);
});
