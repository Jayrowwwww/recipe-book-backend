import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { recipes, users } from "@/db/schema";
import type { CreateRecipeInput, UpdateRecipeInput } from "@/schema/recipe-schema";

// Columns a guest may read. The owner's user id is deliberately excluded so
// public responses can never expose account identifiers.
const publicRecipeColumns = {
  id: recipes.id,
  name: recipes.name,
  description: recipes.description,
  cuisine: recipes.cuisine,
  mealType: recipes.mealType,
  difficulty: recipes.difficulty,
  cookTimeMinutes: recipes.cookTimeMinutes,
  tags: recipes.tags,
  image: recipes.image,
  ingredients: recipes.ingredients,
  instructions: recipes.instructions,
  createdAt: recipes.createdAt,
};

export class RecipeRepository {
  // Admin list: include the owner's name without exposing private account fields.
  async findAllWithOwners() {
    return db
      .select({
        ...getTableColumns(recipes),
        ownerName: users.name,
      })
      .from(recipes)
      .innerJoin(users, eq(recipes.userId, users.id));
  }

  async findAll(userId?: string) {
    // Newest first; an owner filter returns one user's recipes, omitting it lists all.
    return db
      .select()
      .from(recipes)
      .where(userId ? eq(recipes.userId, userId) : undefined)
      .orderBy(desc(recipes.createdAt));
  }

  // Public catalogue for guests: recipe fields only, newest first.
  async findAllPublic() {
    return db.select(publicRecipeColumns).from(recipes).orderBy(desc(recipes.createdAt));
  }

  // One public recipe by id without an ownership filter, for guests.
  async findByIdPublic(id: string) {
    const [recipe] = await db
      .select(publicRecipeColumns)
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1);

    return recipe;
  }

  async findById(id: string, userId?: string) {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(
        and(
          eq(recipes.id, id),
          userId ? eq(recipes.userId, userId) : undefined,
        ),
      )
      .limit(1);

    return recipe;
  }

  async create(data: CreateRecipeInput, userId: string) {
    const [recipe] = await db
      .insert(recipes)
      .values({ ...data, userId })
      .returning();

    return recipe;
  }

  async update(id: string, data: UpdateRecipeInput, userId?: string) {
    const [recipe] = await db
      .update(recipes)
      .set(data)
      .where(
        and(
          eq(recipes.id, id),
          userId ? eq(recipes.userId, userId) : undefined,
        ),
      )
      .returning();

    return recipe;
  }

  async delete(id: string, userId?: string) {
    const [recipe] = await db
      .delete(recipes)
      .where(
        and(
          eq(recipes.id, id),
          userId ? eq(recipes.userId, userId) : undefined,
        ),
      )
      .returning();

    return recipe;
  }
}
