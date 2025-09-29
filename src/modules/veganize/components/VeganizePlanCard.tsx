"use client";

import React from "react";

type Swap = {
  original: string;
  veganAlternative: string;
  notes?: string;
};

type VeganizePlan = {
  dish: string;
  overview: string;
  swaps: Swap[];
  steps: string[];
};

export default function VeganizePlanCard({ plan }: { plan: VeganizePlan }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-accent bg-white/80 p-8 shadow-lg">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-12 h-32 w-32 rounded-full bg-highlight/15 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-28 w-28 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <header className="relative mb-8 text-center">
        <h2 className="text-3xl font-semibold text-primary">{plan.dish}</h2>
        <p className="mt-3 text-base text-primary/75">{plan.overview}</p>
      </header>

      <section className="relative rounded-2xl bg-background/80 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-highlight">Vegane Alternativen</h3>
        <ul className="mt-4 space-y-3 text-primary">
          {plan.swaps.map((swap, index) => (
            <li
              key={`${swap.original}-${index}`}
              className="rounded-2xl bg-white/70 p-4 text-sm shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold text-primary/80">{swap.original}</span>
                <span className="rounded-lg bg-highlight px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  → {swap.veganAlternative}
                </span>
              </div>
              {swap.notes && <p className="mt-2 text-sm text-primary/70">{swap.notes}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="relative mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-highlight">Umsetzungsplan</h3>
        <ol className="mt-4 space-y-4 text-primary">
          {plan.steps.map((step, index) => (
            <li
              key={`${index}-${step.slice(0, 10)}`}
              className="flex gap-4 rounded-2xl bg-background/70 p-4 text-sm shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {index + 1}
              </span>
              <span className="leading-relaxed text-primary/80">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
