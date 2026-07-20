import prisma from "./db.ts";

async function main() {
  // Рецепти з тегом "Вегетаріанське"
  const vegetarianRecipes = await prisma.recipe.findMany({
    where: {
      tags: {
        some: {
          name: "Вегетаріанське",
        },
      },
    },
    include: { tags: true },
  });

  console.log("Вегетаріанські рецепти:");
  vegetarianRecipes.forEach((r) => {
    console.log(`- ${r.title}`);
    console.log(`  Теги: ${r.tags.map((t) => t.name).join(", ")}`);
  });
}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
