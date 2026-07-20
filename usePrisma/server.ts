import express, { Request, Response, NextFunction } from "express";
import prisma from "./db.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

// Маршрути будуть тут
interface CreateRecipeBody {
  title?: string;
  ingredients?: string[];
  instructions?: string;
  cookingTime?: number;
  servings?: number;
  chefName?: string;
  categoryId?: number;
}

interface UpdateRecipeBody {
  title?: string;
  ingredients?: string[];
  instructions?: string;
  cookingTime?: number;
  servings?: number;
  chefName?: string;
}

app.get(
  "/recipes",
  async (
    req: Request<
      {},
      {},
      {},
      { category?: string; maxTime?: string; search?: string }
    >,
    res: Response,
    next: NextFunction,
  ) => {
    const { category, maxTime, search } = req.query;

    const where: any = {};

    if (category) {
      const categoryId = parseInt(category);
      if (!isNaN(categoryId)) {
        where.categoryId = categoryId;
      }
    }

    if (maxTime) {
      const time = parseInt(maxTime);
      if (!isNaN(time) && time > 0) {
        where.cookingTime = { lte: time };
      }
    }

    if (search) {
      where.title = {
        contains: search,
      };
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(recipes);
  },
);

app.get(
  "/recipes/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const recipeId = parseInt(req.params.id);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        error: "ID рецепта має бути числом",
      });
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        category: true,
        tags: true,
        reviews: true,
      },
    });

    if (!recipe) {
      return res.status(404).json({
        error: "Рецепт не знайдено",
      });
    }

    res.json(recipe);
  },
);

app.post(
  "/recipes",
  async (
    req: Request<{}, {}, CreateRecipeBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const {
      title,
      ingredients,
      instructions,
      cookingTime,
      servings,
      chefName,
      categoryId,
    } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        error: "Поля title, ingredients та instructions є обов'язковими",
      });
    }

    if (!cookingTime || cookingTime <= 0) {
      return res.status(400).json({
        error: "Час приготування має бути більшим за 0",
      });
    }

    if (!servings || servings <= 0) {
      return res.status(400).json({
        error: "Кількість порцій має бути більшою за 0",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        error: "Необхідно вказати категорію",
      });
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        instructions,
        cookingTime,
        servings,
        chefName: chefName || "Анонім",
        categoryId,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(recipe);
  },
);

app.patch(
  "/recipes/:id",
  async (
    req: Request<{ id: string }, {}, UpdateRecipeBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const recipeId = parseInt(req.params.id);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        error: "ID рецепта має бути числом",
      });
    }

    const {
      title,
      ingredients,
      instructions,
      cookingTime,
      servings,
      chefName,
    } = req.body;

    if (cookingTime !== undefined && cookingTime <= 0) {
      return res.status(400).json({
        error: "Час приготування має бути більшим за 0",
      });
    }

    if (servings !== undefined && servings <= 0) {
      return res.status(400).json({
        error: "Кількість порцій має бути більшою за 0",
      });
    }

    const dataToUpdate = {
      ...(title !== undefined && { title }),
      ...(ingredients !== undefined && { ingredients }),
      ...(instructions !== undefined && { instructions }),
      ...(cookingTime !== undefined && { cookingTime }),
      ...(servings !== undefined && { servings }),
      ...(chefName !== undefined && { chefName }),
    };

    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: dataToUpdate,
      include: {
        category: true,
      },
    });

    res.json(recipe);
  },
);

app.delete(
  "/recipes/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const recipeId = parseInt(req.params.id);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        error: "ID рецепта має бути числом",
      });
    }

    await prisma.recipe.delete({
      where: { id: recipeId },
    });

    res.status(204).send();
  },
);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Маршрут не знайдено",
    path: req.path,
    method: req.method,
  });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Помилка:", error);

  const prismaErrorMap: Record<string, { status: number; message: string }> = {
    P2025: { status: 404, message: "Запис не знайдено" },
    P2003: { status: 400, message: "Зв'язаний запис не існує" },
    P2002: { status: 400, message: "Запис з такими даними вже існує" },
    P2026: { status: 400, message: "Порушення обмеження унікальності" },
    P2014: { status: 400, message: "Помилка зв'язку між записами" },
    P2009: { status: 400, message: "Помилка валідації даних" },
  };

  if ("code" in error && prismaErrorMap[(error as any).code]) {
    const { status, message } = prismaErrorMap[(error as any).code];
    return res.status(status).json({
      error: message,
      code: (error as any).code,
    });
  }

  if (
    error instanceof SyntaxError &&
    "status" in error &&
    (error as any).status === 400 &&
    "body" in error
  ) {
    return res.status(400).json({
      error: "Некоректний JSON у тілі запиту",
    });
  }

  res.status(500).json({
    error: "Внутрішня помилка сервера",
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на <http://localhost>:${PORT}`);
});
