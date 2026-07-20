import prisma from "./db.ts";

// async function main() {
//   // Знаходимо рецепт за ID
//   const recipe = await prisma.recipe.findUnique({
//     where: { id: 1 },
//   });

//   console.log("Знайдено рецепт:", recipe);
// }

// try {
//   await main();
// } catch (error) {
//   console.error(error);
// } finally {
//   await prisma.$disconnect();
// }

// const quickRecipe = await prisma.recipe.findFirst({
//   where: { cookingTime: { lte: 20 } },
// });

// console.log("Швидкий рецепт:", quickRecipe?.title);

const allRecipes = await prisma.recipe.findMany();

console.log("Всього рецептів:", allRecipes.length);
allRecipes.forEach((recipe) => {
  console.log(`- ${recipe.title} (${recipe.cookingTime} хв)`);
});
