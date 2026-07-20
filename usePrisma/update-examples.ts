import prisma from "./db.ts";

// async function main() {
//   const updatedRecipe = await prisma.recipe.update({
//     where: { id: 1 },
//     data: {
//       cookingTime: 50,
//       servings: 10,
//     },
//   });

//   console.log("Оновлено рецепт:", updatedRecipe.title);
//   console.log("Новий час приготування:", updatedRecipe.cookingTime);
//   console.log("Нова кількість порцій:", updatedRecipe.servings);
// }

// try {
//   await main();
// } catch (error) {
//   console.error(error);
// } finally {
//   await prisma.$disconnect();
// }

// const result = await prisma.recipe.updateMany({
//   where: { categoryId: 1 },
//   data: { chefName: "Олена Юріївна Кравець" },
// });

// console.log("Оновлено рецептів:", result.count);
// Спочатку подивимося скільки відгуків має рецепт
const recipeBefore = await prisma.recipe.findUnique({
  where: { id: 2 },
  include: { reviews: true },
});

console.log(
  `Рецепт "${recipeBefore?.title}" має ${recipeBefore?.reviews.length} відгуків`,
);

// Видаляємо рецепт - тепер це працює без помилок
const deleted = await prisma.recipe.delete({
  where: { id: 2 },
});

console.log(`Видалено рецепт: ${deleted.title}`);

// Перевіряємо чи залишилися відгуки
const orphanedReviews = await prisma.review.findMany({
  where: { recipeId: 2 },
});

console.log(`Відгуків після видалення: ${orphanedReviews.length}`);
