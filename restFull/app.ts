import express from "express";
import type { NextFunction, Request, Response } from "express";
import recipesRoutes from "./src/routes/recipes.routes.ts";

const app = express();

app.use(express.json());

app.use("/api/recipes", recipesRoutes);

// 404 Not Found handler - must be after all routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err.code === "P2025") {
    return res.status(404).json({ error: "Resource not found" });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ error: "Unique constraint violation" });
  }

  if (err.code === "P2003") {
    return res.status(400).json({ error: "Foreign key constraint failed" });
  }

  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
