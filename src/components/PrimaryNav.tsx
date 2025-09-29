"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/upload", label: "Zutaten → Rezept" },
  { href: "/veganize", label: "Gericht veganisieren" },
  { href: "/style-guide", label: "Style Guide" },
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
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-primary"
          onClick={close}
        >
          <Image
            src="/logo.svg"
            alt="veganeWunder"
            width={36}
            height={36}
            priority
          />
          <span className="sr-only">veganeWunder</span>
        </Link>

        <button
          type="button"
          className="rounded-full border border-accent/60 px-3 py-1 text-sm font-medium text-primary shadow-sm transition hover:bg-accent sm:hidden"
          onClick={toggle}
        >
          Menü
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

      <nav
        className={`sm:hidden ${
          isOpen ? "max-h-64 border-t border-accent/60" : "max-h-0"
        } overflow-hidden transition-[max-height] duration-300 ease-in-out`}
      >
        <ul className="space-y-2 px-4 py-4 text-sm font-medium text-primary/80">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className={`block rounded-xl px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight ${
                    active ? "bg-highlight text-white" : "bg-background hover:bg-accent hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
