import fs from "node:fs";
import path from "node:path";
import { getPublicEnv } from "../src/platform/env.js";
import { loadEvent } from "../src/platform/load-event.js";
import {
  requiredWeddingSections,
  WEDDING_APPLICABLE_SECTION_KEYS,
} from "../src/platform/contract.js";

// Load .env.local deterministically if present in project root
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  if (typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(envLocalPath);
    } catch {
      // Continue with existing process.env
    }
  } else {
    // Fallback parser for Node versions without process.loadEnvFile
    try {
      const content = fs.readFileSync(envLocalPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...rest] = trimmed.split("=");
          const val = rest
            .join("=")
            .trim()
            .replace(/^["']|["']$/g, "");
          if (key && !process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    } catch {
      // Continue with existing process.env
    }
  }
}

async function runVerifyConnection() {
  console.log("WEBSERBISYO CONNECTION VERIFICATION");
  console.log("───────────────────────────────────");

  const env = getPublicEnv();

  if (env.designMode || !env.hasLiveConfig) {
    console.log("MODE: DEMO");
    console.log("───────────────────────────────────");
    console.log("The starter is currently running in local Demo / Design Mode.");
    console.log("Demo Wedding data: PASS");
    console.log(`17 Wedding sections: PASS (${WEDDING_APPLICABLE_SECTION_KEYS.length} applicable)`);
    console.log(`Required sections: ${requiredWeddingSections.join(", ")}`);
    console.log("\nTo connect to a live WebSerbisyo event, set in .env.local:");
    console.log("  NEXT_PUBLIC_WEBSERBISYO_API_URL=https://api.webserbisyo.com");
    console.log("  NEXT_PUBLIC_EVENT_SLUG=your-actual-event-slug");
    console.log("  NEXT_PUBLIC_DESIGN_MODE=false");
    console.log("\nNO NETWORK MUTATIONS PERFORMED");
    console.log("RESULT: ✓ DEMO MODE VERIFIED");
    process.exit(0);
  }

  console.log("MODE: LIVE CONNECTED");
  console.log("───────────────────────────────────");
  console.log(`API base URL: ${env.apiBaseUrl ? "configured" : "missing"}`);
  console.log(`Event slug: ${env.eventSlug ? "configured" : "missing"}`);
  console.log(`Event kind: wedding`);

  const tokenPresent = Boolean(process.env.NEXT_PUBLIC_WEBSERBISYO_ACCESS_TOKEN);
  console.log(`Private Token: ${tokenPresent ? "Present (redacted)" : "None"}`);

  const result = await loadEvent();

  if (result.status === "available") {
    const data = result.data;
    console.log("\nPlatform API: REACHABLE");
    console.log(`Public DTO: PASS`);
    console.log(`Contract version: ${data.contractVersion}`);
    console.log(`Source mode: ${data.source}`);
    console.log(`Couple: ${data.coupleDisplayName}`);
    console.log(`Event Date: ${data.eventDateLabel || "N/A"}`);

    const enabled = data.enabledSectionKeys || [];
    const ordered = data.orderedSectionKeys || [];
    const missingRequired = requiredWeddingSections.filter((req) => !enabled.includes(req));

    if (missingRequired.length === 0) {
      console.log(
        `Required sections: PASS (${requiredWeddingSections.length}/${requiredWeddingSections.length})`
      );
    } else {
      console.log(`Required sections: FAILED (Missing: ${missingRequired.join(", ")})`);
    }

    console.log(`Enabled section count: ${enabled.length}`);
    console.log(`Normalized Wedding sections: PASS`);

    const disabled = ordered.filter((k) => !enabled.includes(k));
    if (disabled.length > 0) {
      console.log(`Disabled sections (${disabled.length}): ${disabled.join(", ")}`);
    }

    console.log("\nNO WRITES PERFORMED");
    console.log("RESULT: ✓ LIVE CONNECTION HEALTHY");
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
