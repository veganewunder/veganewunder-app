"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import HamburgerIcon from "./HamburgerIcon";

const links = [
  { href: "/upload", label: "Zutaten → Rezept" },
  { href: "/veganize", label: "Gericht veganisieren" },
];

export default function PrimaryNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-accent/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight text-primary"
          onClick={close}
        >
          Vegane Wunder
        </Link>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/60 bg-white/70 text-primary shadow-sm transition hover:bg-accent sm:hidden"
          onClick={toggle}
          aria-label="Navigation umschalten"
        >
          <HamburgerIcon open={isOpen} />
        </button>

        <nav className="hidden items-center gap-2 text-sm font-medium text-primary/80 sm:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight ${
                  active ? "bg-highlight text-white" : "hover:bg-accent hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <AnimatePresence>{isOpen && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden border-t border-accent/60 bg-background/95 sm:hidden"
        >
          <ul className="space-y-2 px-4 py-4 text-sm font-medium text-primary/80">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <motion.li
                  key={link.href}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    className={`block rounded-xl px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight ${
                      active ? "bg-highlight text-white" : "bg-background hover:bg-accent hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </motion.nav>
      )}</AnimatePresence>
    </header>
  );
}
