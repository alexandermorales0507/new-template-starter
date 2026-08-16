"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "../ui/cn";

export interface StaggerListProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "none";
}

export function StaggerList({
  children,
  className,
  itemClassName,
  staggerDelay = 0.08,
  direction = "up",
}: StaggerListProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {React.Children.map(children, (child, i) => (
          <div key={i} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 16 : direction === "down" ? -16 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={cn(className)}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariants} className={itemClassName}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
