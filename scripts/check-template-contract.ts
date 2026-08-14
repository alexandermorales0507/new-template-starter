import fs from "node:fs";
import path from "node:path";
import {
  eventWebsiteSectionContract,
  EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  eventWebsiteSectionKeySet,
  WEDDING_APPLICABLE_SECTION_KEYS,
  weddingApplicableSectionKeySet,
} from "../src/platform/contract.js";
import { templateSectionRegistry } from "../src/template/section-registry.js";
import { demoWeddingData } from "../src/platform/demo-wedding.js";
import { deriveCoupleIdentity } from "../src/template/utils/couple-identity.js";
import {
  formatEventDateLong,
  formatEventTime,
  formatTimeRange,
  formatRsvpDeadline,
} from "../src/template/utils/event-formatting.js";
import { buildWeddingNavigation } from "../src/template/navigation/wedding-navigation.js";

type CheckResult = {
  passed: boolean;
  failures: string[];
  warnings: string[];
};

console.log("WebSerbisyo Wedding Template Contract Check");
console.log("──────────────────────────────────────────");

const result: CheckResult = {
  passed: true,
  failures: [],
  warnings: [],
};

// 1. CONTRACT VERSION VERIFICATION
console.log("\n[1] CONTRACT VERSION VERIFICATION");
if (EVENT_WEBSITE_SECTION_CONTRACT_VERSION === 1) {
  console.log(
    `✓ Contract version: ${EVENT_WEBSITE_SECTION_CONTRACT_VERSION} (Event Website Sections V1)`
  );
} else {
  result.passed = false;
  result.failures.push(
    `Unexpected contract version: ${EVENT_WEBSITE_SECTION_CONTRACT_VERSION}. Expected 1.`
  );
  console.log(`✗ Contract version: ${EVENT_WEBSITE_SECTION_CONTRACT_VERSION}`);
}

// 2. SECTION REGISTRY & WEDDING SCOPE VALIDATION
console.log("\n[2] WEDDING SECTION REGISTRY SCOPE VALIDATION");
const globalKeys = eventWebsiteSectionContract.map((entry) => entry.key);
const weddingKeys = WEDDING_APPLICABLE_SECTION_KEYS;
const registeredKeys = Object.keys(templateSectionRegistry);

console.log(`Global contract sections: ${globalKeys.length}`);
console.log(`Wedding applicable sections: ${weddingKeys.length}`);
console.log(`Registered template section components: ${registeredKeys.length}`);

if (globalKeys.length !== 20) {
  result.passed = false;
  result.failures.push(`Global contract count mismatch. Expected 20, got ${globalKeys.length}`);
}

if (weddingKeys.length !== 17) {
  result.passed = false;
  result.failures.push(
    `Wedding applicable section count mismatch. Expected 17, got ${weddingKeys.length}`
  );
}

if (registeredKeys.length !== 17) {
  result.passed = false;
  result.failures.push(
    `Template section registry count mismatch. Expected 17, got ${registeredKeys.length}`
  );
}

let missingCount = 0;
for (const key of weddingKeys) {
  if (templateSectionRegistry[key]) {
    console.log(`  ✓ Registered Wedding Renderer: ${key}`);
  } else {
    missingCount++;
    result.failures.push(`Missing template renderer for wedding key: '${key}'`);
    console.log(`  ✗ MISSING WEDDING RENDERER: ${key}`);
  }
}

const forbiddenWeddingKeys = ["eighteen_roses_candles", "debut_court", "godparents"];
for (const key of forbiddenWeddingKeys) {
  if (templateSectionRegistry[key]) {
    result.failures.push(`Forbidden non-wedding section renderer registered: '${key}'`);
    console.log(`  ✗ FORBIDDEN RENDERER REGISTERED: ${key}`);
  }
}

for (const regKey of registeredKeys) {
  if (!weddingApplicableSectionKeySet.has(regKey)) {
    result.failures.push(
      `Unknown or non-wedding section key registered in templateSectionRegistry: '${regKey}'`
    );
    console.log(`  ✗ UNKNOWN/NON-WEDDING KEY REGISTERED: ${regKey}`);
  }
}

if (missingCount === 0 && registeredKeys.length === 17) {
  console.log(`✓ Template section registry correctly contains exactly 17 Wedding renderers.`);
} else {
  result.passed = false;
}

// 3. DEMO DATA VALIDATION
console.log("\n[3] DEMO DATA VALIDATION");
if (
  demoWeddingData &&
  demoWeddingData.eventSlug &&
  Array.isArray(demoWeddingData.enabledSectionKeys) &&
  demoWeddingData.couple &&
  demoWeddingData.ceremony &&
  demoWeddingData.venue &&
  demoWeddingData.rsvp &&
  demoWeddingData.gifts
) {
  console.log(`✓ Demo wedding dataset ('${demoWeddingData.eventSlug}') is valid and complete.`);
} else {
  result.passed = false;
  result.failures.push(
    "src/platform/demo-wedding.ts is missing required WeddingTemplateData fields."
  );
  console.log("✗ Demo wedding dataset failed validation.");
}

// Verify gift options in demo data
if (demoWeddingData.gifts?.options) {
  if (demoWeddingData.gifts.options.length > 2) {
    result.passed = false;
    result.failures.push(
      `Demo gift options exceed maximum limit of 2 (found ${demoWeddingData.gifts.options.length}).`
    );
  }
  for (const opt of demoWeddingData.gifts.options as Record<string, unknown>[]) {
    if (opt.accountName || opt.accountNumber) {
      result.passed = false;
      result.failures.push(
        `Non-canonical gift option field found in demo data: ${JSON.stringify(opt)}`
      );
    }
  }
}

// Verify non-wedding sections absent from demo section list
for (const secKey of forbiddenWeddingKeys) {
  if (demoWeddingData.enabledSectionKeys?.includes(secKey)) {
    result.passed = false;
    result.failures.push(`Forbidden non-wedding section enabled in demo data: '${secKey}'`);
  }
}

// 4. PLATFORM CORE & RSVP GUARD
console.log("\n[4] PLATFORM CORE & RSVP GUARD");
const requiredPlatformFiles = [
  "src/platform/load-event.ts",
  "src/platform/normalize-event.ts",
  "src/platform/submit-rsvp.ts",
  "src/platform/preview-context.ts",
  "src/platform/section-visibility.ts",
  "src/platform/wedding-template-data.ts",
  "src/platform/contract.ts",
  "src/platform/demo-wedding.ts",
];

for (const relPath of requiredPlatformFiles) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✓ Platform file present: ${relPath}`);
  } else {
    result.passed = false;
    result.failures.push(`Missing critical platform core file: ${relPath}`);
    console.log(`  ✗ MISSING PLATFORM FILE: ${relPath}`);
  }
}

// 5. DIRECT DATABASE ACCESS & API DUPLICATION GUARD
console.log("\n[5] DIRECT DATABASE & API DUPLICATION GUARD");
function scanDirForForbiddenCode(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && (file.name.endsWith(".ts") || file.name.endsWith(".tsx"))) {
      const filePath = path.join(file.parentPath || file.path, file.name);
      const content = fs.readFileSync(filePath, "utf-8");

      if (content.includes("@supabase/supabase-js") || content.includes("createClient(")) {
        result.passed = false;
        result.failures.push(
          `Direct Supabase/database client usage found in template file: ${filePath}`
        );
        console.log(`  ✗ FORBIDDEN DB CLIENT: ${filePath}`);
      }

      // Check for hardcoded API calls in template visual sections
      if (
        filePath.includes("/template/sections/") &&
        !filePath.includes("RSVP.tsx") &&
        (content.includes("fetch('/api/") || content.includes('fetch("/api/'))
      ) {
        result.warnings.push(`Potential direct API fetch in visual section: ${filePath}`);
        console.log(`  ⚠ WARNING: Direct API fetch in visual section: ${filePath}`);
      }
    }
  }
}
scanDirForForbiddenCode(path.resolve(process.cwd(), "src/template"));

// 6. DYNAMIC COUPLE IDENTITY & EVENT FORMATTING GUARD
console.log("\n[6] DYNAMIC COUPLE IDENTITY & EVENT FORMATTING GUARD");
const derivedTest = deriveCoupleIdentity("Alex Rivera", "Jamie Cruz");
if (derivedTest.monogram === "A & J" && derivedTest.compactMonogram === "AJ") {
  console.log(
    "  ✓ Couple identity derivation verified: 'Alex Rivera' + 'Jamie Cruz' -> 'A & J' / 'AJ'"
  );
} else {
  result.passed = false;
  result.failures.push(
    `Couple identity derivation test failed. Got monogram '${derivedTest.monogram}'`
  );
  console.log(`  ✗ IDENTITY DERIVATION TEST FAILED: ${JSON.stringify(derivedTest)}`);
}

const formattedDateTest = formatEventDateLong("2027-04-19");
const formattedTimeTest = formatTimeRange("16:00", "17:30");
const formattedDeadlineTest = formatRsvpDeadline("2027-03-07T23:59");

if (
  formattedDateTest === "Monday, April 19, 2027" &&
  formattedTimeTest === "4:00 PM – 5:30 PM" &&
  formattedDeadlineTest.includes("March 7, 2027")
) {
  console.log("  ✓ Event formatting helpers verified (date, time range, RSVP deadline)");
} else {
  result.passed = false;
  result.failures.push("Event formatting validation failed.");
  console.log("  ✗ FORMATTING VALIDATION FAILED");
}

// 7. CANONICAL NAVIGATION MODEL GUARD
console.log("\n[7] CANONICAL NAVIGATION MODEL GUARD");
const navTest = buildWeddingNavigation(demoWeddingData);
if (
  navTest.primaryNavItems.length > 0 &&
  navTest.dockItems.length > 0 &&
  navTest.moreGroups.length > 0
) {
  console.log(
    `  ✓ Navigation model verified: ${navTest.primaryNavItems.length} primary links, ${navTest.dockItems.length} dock shortcuts, ${navTest.moreGroups.length} categories`
  );
} else {
  result.passed = false;
  result.failures.push("Canonical navigation model generator failed validation.");
  console.log("  ✗ NAVIGATION MODEL VALIDATION FAILED");
}

// 8. PROHIBITED CLIENT RESIDUE & STALE ALIAS SCAN
console.log("\n[8] PROHIBITED CLIENT RESIDUE & STALE ALIAS SCAN");
const prohibitedTerms = [
  "Princess Anne",
  "Rafael",
  "Isabella",
  "Dianne",
  "Blue Hour",
  "Template Starter V2",
];
const forbiddenFieldPatterns = [
  { pattern: "groomParents", reason: "Parent fields are not in host_info" },
  { pattern: "brideParents", reason: "Parent fields are not in host_info" },
  { pattern: "accountName", reason: "Non-canonical gift option field" },
  { pattern: "accountNumber", reason: "Non-canonical gift option field" },
];

function scanForResidueAndAliases(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && !file.name.endsWith(".gitkeep")) {
      const filePath = path.join(file.parentPath || file.path, file.name);
      if (
        filePath.includes("node_modules") ||
        filePath.includes(".next") ||
        filePath.includes("check-template-contract") ||
        filePath.includes(".git") ||
        filePath.includes("README") ||
        filePath.includes("TEMPLATE_GUIDE")
      )
        continue;
      const content = fs.readFileSync(filePath, "utf-8");
      for (const term of prohibitedTerms) {
        if (content.includes(term)) {
          result.passed = false;
          result.failures.push(`Prohibited client residue '${term}' found in: ${filePath}`);
          console.log(`  ✗ RESIDUE FOUND: '${term}' in ${filePath}`);
        }
      }
      for (const { pattern, reason } of forbiddenFieldPatterns) {
        if (content.includes(pattern)) {
          result.passed = false;
          result.failures.push(
            `Forbidden field pattern '${pattern}' found in ${filePath} (${reason})`
          );
          console.log(`  ✗ FORBIDDEN PATTERN: '${pattern}' in ${filePath}`);
        }
      }
    }
  }
}
scanForResidueAndAliases(path.resolve(process.cwd(), "src"));

// 9. SUMMARY
console.log("\n──────────────────────────────────────────");
if (result.warnings.length > 0) {
  console.log(`WARNINGS (${result.warnings.length}):`);
  for (const w of result.warnings) {
    console.log(`  ⚠ ${w}`);
  }
}

if (result.failures.length > 0) {
  console.log(`FAILURES (${result.failures.length}):`);
  for (const f of result.failures) {
    console.log(`  ✗ ${f}`);
  }
  console.log("\nRESULT: ✗ TEMPLATE CONTRACT CHECK FAILED");
  process.exit(1);
} else {
  console.log("RESULT: ✓ WEBSERBISYO TEMPLATE CONTRACT PASSED");
  process.exit(0);
}
