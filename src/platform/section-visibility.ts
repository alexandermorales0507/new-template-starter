// PLATFORM VISIBILITY — RESPECT DASHBOARD STATE.

import { eventWebsiteSectionKeySet, requiredEventSections, EventSectionKey } from "./contract";
import type { NormalizedSection } from "./event-template-data";

export function isSectionEnabled(
  key: string,
  sections: NormalizedSection[],
  enabledKeys?: string[]
): boolean {
  if (requiredEventSections.includes(key as EventSectionKey)) {
    return true;
  }
  if (enabledKeys && enabledKeys.length > 0) {
    return enabledKeys.includes(key);
  }
  const match = sections.find((s) => s.key === key);
  return match ? match.enabled : false;
}

export function filterAndOrderSections(
  sections: NormalizedSection[],
  order?: string[],
  enabledKeys?: string[]
): NormalizedSection[] {
  const sectionMap = new Map<string, NormalizedSection>();
  for (const sec of sections) {
    sectionMap.set(sec.key, sec);
  }

  const keysToProcess = order && order.length > 0 ? order : Array.from(sectionMap.keys());

  const result: NormalizedSection[] = [];
  const processed = new Set<string>();

  for (const key of keysToProcess) {
    if (!eventWebsiteSectionKeySet.has(key)) continue;
    const sec = sectionMap.get(key);
    if (!sec) continue;

    const enabled = isSectionEnabled(key, sections, enabledKeys);
    if (enabled) {
      result.push({ ...sec, enabled: true });
      processed.add(key);
    }
  }

  for (const sec of sections) {
    if (!processed.has(sec.key) && eventWebsiteSectionKeySet.has(sec.key)) {
      if (isSectionEnabled(sec.key, sections, enabledKeys)) {
        result.push({ ...sec, enabled: true });
      }
    }
  }

  return result;
}
