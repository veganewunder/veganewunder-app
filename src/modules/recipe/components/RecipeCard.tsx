"use client";

import React from "react";

interface Ingredient {
  name: string;
  amount: string;
}

interface Recipe {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  steps: string[];
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-accent bg-white/80 p-8 shadow-lg">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-16 top-10 h-32 w-32 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute -right-10 bottom-6 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <header className="relative mb-8 text-center">
        <h2 className="text-3xl font-semibold text-primary">{recipe.title}</h2>
        {recipe.description && (
          <p className="mt-3 text-base text-primary/75">{recipe.description}</p>
        )}
      </header>

      <section className="relative rounded-2xl bg-background/80 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-highlight">Zutaten</h3>
        <ul className="mt-4 grid gap-3 text-primary">
          {recipe.ingredients.map((ingredient, index) => (
            <li
              key={`${ingredient.name}-${index}`}
              className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-2 text-sm shadow-sm"
            >
              <span className="font-medium">{ingredient.name}</span>
              <span className="text-primary/65">{ingredient.amount}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-highlight">Zubereitung</h3>
        <ol className="mt-4 space-y-4 text-primary">
          {recipe.steps.map((step, index) => (
            <li
              key={`${index}-${step.slice(0, 10)}`}
              className="flex gap-4 rounded-2xl bg-background/70 p-4 text-sm shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-highlight text-sm font-semibold text-white">
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
