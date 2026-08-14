import fs from "node:fs";
import path from "node:path";
import {
  eventWebsiteSectionContract,
  EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  eventWebsiteSectionKeySet,
} from "../src/platform/contract.js";
import { templateSectionRegistry } from "../src/template/section-registry.js";
import { demoWeddingData } from "../src/platform/demo-wedding.js";
import { deriveCoupleIdentity } from "../src/template/utils/couple-identity.js";

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

// 2. SECTION REGISTRY VALIDATION
console.log("\n[2] CANONICAL SECTION REGISTRY VALIDATION");
const canonicalKeys = eventWebsiteSectionContract.map((entry) => entry.key);
const registeredKeys = Object.keys(templateSectionRegistry);

console.log(`Discovered ${canonicalKeys.length} canonical contract sections.`);
console.log(`Discovered ${registeredKeys.length} registered template section components.`);

let missingCount = 0;
for (const key of canonicalKeys) {
  if (templateSectionRegistry[key]) {
    console.log(`  ✓ Registered: ${key}`);
  } else {
    missingCount++;
    result.failures.push(`Missing section renderer for canonical key: '${key}'`);
    console.log(`  ✗ MISSING: ${key}`);
  }
}

for (const regKey of registeredKeys) {
  if (!eventWebsiteSectionKeySet.has(regKey)) {
    result.failures.push(`Unknown section key registered in templateSectionRegistry: '${regKey}'`);
    console.log(`  ✗ UNKNOWN KEY REGISTERED: ${regKey}`);
  }
}

if (missingCount === 0) {
  console.log(`✓ All ${canonicalKeys.length} canonical section keys have registered renderers.`);
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
  demoWeddingData.rsvp
) {
  console.log(`✓ Demo wedding dataset ('${demoWeddingData.eventSlug}') is valid and complete.`);
} else {
  result.passed = false;
  result.failures.push(
    "src/platform/demo-wedding.ts is missing required WeddingTemplateData fields."
  );
  console.log("✗ Demo wedding dataset failed validation.");
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

// 6. DYNAMIC COUPLE IDENTITY GUARD
console.log("\n[6] DYNAMIC COUPLE IDENTITY GUARD");
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

// 7. PROHIBITED CLIENT RESIDUE SCAN
console.log("\n[7] PROHIBITED CLIENT RESIDUE SCAN");
const prohibitedTerms = ["Princess Anne", "Rafael", "Isabella", "Dianne", "Blue Hour"];
function scanForResidue(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && !file.name.endsWith(".gitkeep")) {
      const filePath = path.join(file.parentPath || file.path, file.name);
      // Skip node_modules or .next if any
      if (
        filePath.includes("node_modules") ||
        filePath.includes(".next") ||
        filePath.includes("check-template-contract")
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
    }
  }
}
scanForResidue(path.resolve(process.cwd(), "src"));

// 8. SUMMARY
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
