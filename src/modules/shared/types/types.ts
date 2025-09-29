export type Ingredient = {
  name: string;
  amount: string;
};

export type Recipe = {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
};

export type AnalyzeResponse = {
  ingredients: Ingredient[];
};

export type RecipeResponse = {
  recipe: Recipe;
};
