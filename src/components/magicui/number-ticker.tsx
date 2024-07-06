"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

export default function NumberTicker({
  value,
  delay = 0,
  className,
  onView = false,
}: {
  value: number;
  className?: string;
  delay?: number; // delay in s
  onView?: boolean;
}) {
  const prevValueRef = useRef(value);
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(prevValueRef.current);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = onView
    ? useInView(ref, { once: true, margin: "0px" })
    : true;

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.textContent = Intl.NumberFormat("pt-BR").format(value);
    }
  }, []);

  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(value);
        prevValueRef.current = value;
      }, delay * 1000);
  }, [motionValue, isInView, delay, value]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("pt-BR").format(
            latest.toFixed(0)
          );
        }
      }),
    [springValue]
  );

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-black dark:text-white tracking-wider",
        className
      )}
      ref={ref}
    />
  );
}
