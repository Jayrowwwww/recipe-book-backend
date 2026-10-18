import { RecipeRepository } from "@/repositories/recipe-repository";

// Public recipe details for guests. No ownership filter is applied here, but
// the repository selects only public columns (no owner identifier).
export async function getPublicRecipeService(id: string) {
  const recipeRepository = new RecipeRepository();

  try {
    const recipe = await recipeRepository.findByIdPublic(id);
    if (!recipe) return { code: 404, status: "error", message: "Recipe not found" };

    return { code: 200, status: "success", data: { recipe } };
  } catch (error) {
    console.error("getPublicRecipeService Error", error);
    return { code: 500, status: "error", message: "Unable to load recipe" };
  }
}
