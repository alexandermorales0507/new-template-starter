"use client";

import { useEffect, useState } from "react";
import type { CountdownData } from "@/platform/wedding-template-data";

// PLATFORM DATA — KEEP DYNAMIC.
// Event countdown timer widget.

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

  return (
    <section
      id="countdown"
      className="template-section py-12 px-4 max-w-3xl mx-auto text-center border-b border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {data.title || "Counting Down To Our Big Day"}
      </h2>
      {data.shortNote && (
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
          {data.shortNote}
        </p>
      )}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto mt-4">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="block text-2xl sm:text-3xl font-bold text-gray-900">
            {timeLeft.days}
          </span>
          <span className="text-[10px] sm:text-xs uppercase text-gray-500 font-medium">Days</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="block text-2xl sm:text-3xl font-bold text-gray-900">
            {timeLeft.hours}
          </span>
          <span className="text-[10px] sm:text-xs uppercase text-gray-500 font-medium">Hours</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="block text-2xl sm:text-3xl font-bold text-gray-900">
            {timeLeft.minutes}
          </span>
          <span className="text-[10px] sm:text-xs uppercase text-gray-500 font-medium">
            Minutes
          </span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="block text-2xl sm:text-3xl font-bold text-gray-900">
            {timeLeft.seconds}
          </span>
          <span className="text-[10px] sm:text-xs uppercase text-gray-500 font-medium">
            Seconds
          </span>
        </div>
      </div>
    </section>
  );
}
