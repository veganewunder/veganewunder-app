"use client";

import { motion } from "framer-motion";

interface HamburgerIconProps {
  open: boolean;
}

export default function HamburgerIcon({ open }: HamburgerIconProps) {
  return (
    <div className="relative h-5 w-6" aria-hidden>
      <motion.span
        animate={open ? "open" : "closed"}
        variants={{
          closed: { y: 0, rotate: 0 },
          open: { y: 8, rotate: 45 },
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-primary"
      />
      <motion.span
        animate={open ? "open" : "closed"}
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-x-0 top-2 h-0.5 rounded-full bg-primary"
      />
      <motion.span
        animate={open ? "open" : "closed"}
        variants={{
          closed: { y: 16, rotate: 0 },
          open: { y: 8, rotate: -45 },
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="absolute inset-x-0 top-4 h-0.5 rounded-full bg-primary"
      />
    </div>
  );
}
