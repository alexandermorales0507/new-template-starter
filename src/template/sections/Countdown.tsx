"use client";

import { useEffect, useState } from "react";
import type { CountdownData } from "@/platform/wedding-template-data";
import { sageDecorations } from "@/template/template-assets";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { SectionFloralDivider } from "@/template/components/decorations/SectionFloralDivider";
import { DecorativePattern } from "@/template/components/decorations/DecorativePattern";
import { AnimatedNumber } from "@/template/components/interactive/AnimatedNumber";
import { Reveal } from "@/template/components/motion/Reveal";

// PLATFORM DATA — KEEP DYNAMIC.
// SAGE ESTATE COUNTDOWN (THE GLASSHOUSE LEDGER)
// Real timer calculations mapped to rolling FLIP digits.

export type CountdownSectionProps = {
  data: CountdownData;
  eventDate?: string | null;
  eventTime?: string | null;
};

export function CountdownSection({ data, eventDate, eventTime }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!eventDate) return;

    const dateParts = eventDate.split("-").map(Number);
    if (dateParts.length < 3 || dateParts.some(isNaN)) return;

    let hours = 16;
    let minutes = 0;

    if (eventTime) {
      const timeParts = eventTime.split(":").map(Number);
      if (timeParts.length >= 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1])) {
        hours = timeParts[0];
        minutes = timeParts[1];
      }
    }

    const targetDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes, 0);
    const targetTime = targetDate.getTime();
    if (isNaN(targetTime)) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [eventDate, eventTime]);

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <section
      id="countdown"
      className="template-section section-surface-sage template-section-compact relative overflow-x-clip"
    >
      {/* Decorative Glasshouse Grid Pattern Background (Readable Strength) */}
      <DecorativePattern
        src={sageDecorations.glasshouseGridPattern}
        opacity={0.35}
        objectPosition="center center"
        blendMode="multiply"
      />

      <div className="template-container-narrow text-center relative z-10">
        <Reveal direction="up" distance={16}>
          <div className="mb-6 sm:mb-8 space-y-2">
            <span className="text-role-subheading">COUNTDOWN RECORD</span>
            <h2 className="text-role-heading text-[var(--wedding-text)]">
              {data.title || "Counting Down To Our Big Day"}
            </h2>
            {data.shortNote && (
              <p className="text-role-lead max-w-md mx-auto leading-relaxed">{data.shortNote}</p>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-xl mx-auto">
            {units.map((unit) => (
              <div
                key={unit.label}
                className="relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border border-[var(--wedding-border)] bg-[var(--wedding-surface)] shadow-xs hover:border-[var(--wedding-accent)]/50 transition-colors overflow-visible"
              >
                {/* Micro Botanical Corner Pair on each Number Card */}
                <BotanicalCornerPair size="xs" />

                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono tracking-tight text-[var(--wedding-text)] tabular-nums relative z-10">
                  <AnimatedNumber value={unit.value} format={{ minimumIntegerDigits: 2 }} />
                </span>
                <span className="mt-1.5 text-xs font-mono font-bold tracking-[0.2em] text-[var(--wedding-text-muted)] uppercase relative z-10">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Boundary Threshold Divider: Countdown -> Music */}
      <SectionFloralDivider />
    </section>
  );
}
