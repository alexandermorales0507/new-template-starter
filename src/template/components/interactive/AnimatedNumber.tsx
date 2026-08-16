"use client";

import React from "react";
import NumberFlow, { useCanAnimate, type Format, type Trend } from "@number-flow/react";
import { cn } from "../ui/cn";

export interface AnimatedNumberProps {
  value: number;
  className?: string;
  format?: Format;
  trend?: Trend;
}

export function AnimatedNumber({ value, className, format, trend }: AnimatedNumberProps) {
  const canAnimate = useCanAnimate();

  return (
    <div className={cn("inline-flex items-center tabular-nums", className)}>
      <NumberFlow value={value} format={format} trend={trend} animated={canAnimate} />
    </div>
  );
}
