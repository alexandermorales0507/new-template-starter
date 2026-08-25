"use client";

import type { ExtraInfoData } from "@/platform/event-template-data";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/template/components/ui/Accordion";
import { Reveal } from "@/template/components/motion/Reveal";

// PLATFORM DATA — KEEP DYNAMIC.

export function ExtraInfoSection({ data }: { data: ExtraInfoData }) {
  if (!data.items || data.items.length === 0) return null;

  return (
    <section
      id="extra_info"
      className="template-section relative overflow-x-clip bg-[var(--event-bg)] text-[var(--event-on-dark,#f8fafc)]"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-10 sm:mb-12 space-y-2">
            <span className="comic-badge comic-badge-gold">MISSION INTEL // GUEST FAQ</span>
            <h2 className="text-role-heading text-[var(--event-on-dark,#f8fafc)] tracking-tight">
              {data.sectionTitle || "Frequently Asked Questions"}
            </h2>
            {data.sectionIntro && (
              <p className="text-role-lead max-w-md mx-auto mt-2 leading-relaxed text-slate-300">
                {data.sectionIntro}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="relative overflow-visible">
            <div className="bg-[var(--event-surface)] rounded-2xl border-2 border-[var(--event-border)] p-6 sm:p-8 shadow-[var(--event-shadow-paper-md)] relative z-10">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {data.items.map((item, idx) => (
                  <AccordionItem
                    key={item.id || idx}
                    value={`item-${idx + 1}`}
                    className="border-b border-[var(--event-border-subtle)] last:border-0"
                  >
                    <AccordionTrigger className="font-serif text-base sm:text-lg font-bold text-[var(--event-text-main)] hover:text-[var(--event-primary)] py-4 text-left">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-[var(--event-text-main)] font-sans leading-relaxed pt-1 pb-4">
                      {item.details}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
