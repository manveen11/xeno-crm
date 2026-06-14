"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

export const ease = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGrid({
  children,
  className,
  stagger = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const StaggerItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 24 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export function MagButton({
  children,
  className,
  style,
  asLink,
  href,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  asLink?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.22);
    y.set((e.clientY - r.top - r.height / 2) * 0.22);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div style={{ x: sx, y: sy }}>
        {asLink ? (
          <Link href={href ?? "#"} className={className} style={style}>{children}</Link>
        ) : (
          <button className={className} style={style} onClick={onClick}>{children}</button>
        )}
      </motion.div>
    </div>
  );
}
