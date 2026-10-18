import { RecipeRepository } from "@/repositories/recipe-repository";

// Guests can browse recipes without logging in. The repository selects only
// public columns, so owner identifiers are never included in the response.
export async function getPublicRecipesService() {
  const recipeRepository = new RecipeRepository();

  try {
    const recipes = await recipeRepository.findAllPublic();
    return { code: 200, status: "success", data: { recipes } };
  } catch (error) {
    console.error("getPublicRecipesService Error", error);
    return { code: 500, status: "error", message: "Unable to load recipes" };
  }
}
