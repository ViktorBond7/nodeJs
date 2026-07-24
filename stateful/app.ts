import express from "express";
import type { NextFunction, Request, Response } from "express";
import "dotenv/config";

import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import session from "express-session";
import BetterSqlite3Store from "better-sqlite3-session-store";
import Database from "better-sqlite3";
import prisma from "./lib/prisma.ts";

declare module "express-session" {
  interface SessionData {
    userId: number;
    username: string;
  }
}

const SqliteStore = BetterSqlite3Store(session);
const db = new Database("sessions.db");

const app = express();
const PORT = 3000;
app.use(cookieParser());

app.use(
  session({
    store: new SqliteStore({ client: db }),
    secret: process.env.SESSION_SECRET!,
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

////////////////////////////
type AuthFormBody = {
  username?: string;
  password?: string;
};

app.get("/", (req, res) => {
  res.render("home", { username: req.session.username || null });
});

app.get("/register", (_req: Request, res: Response) => {
  res.render("register", { error: null, data: null });
});

app.post(
  "/register",
  async (req: Request<{}, {}, AuthFormBody>, res: Response) => {
    const { username, password } = req.body;

    if (!username || username.trim().length < 3) {
      return res.render("register", {
        error: "Ім'я користувача має бути не менше 3 символів",
        data: req.body,
      });
    }

    if (!password || password.length < 6) {
      return res.render("register", {
        error: "Пароль має бути не менше 6 символів",
        data: req.body,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (existingUser) {
      return res.render("register", {
        error: "Користувач з таким іменем вже існує",
        data: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: username.trim(),
        password: hashedPassword,
      },
    });

    res.redirect("/login");
  },
);

////////////////////////////////
////////////////////
app.get("/login", (_req: Request, res: Response) => {
  res.render("login", { error: null, data: null });
});

app.post(
  "/login",
  async (req: Request<{}, {}, AuthFormBody>, res: Response) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username: username?.trim() ?? "" },
    });

    if (!user) {
      return res.render("login", {
        error: "Невірне ім'я користувача або пароль",
        data: req.body,
      });
    }

    const isMatch = await bcrypt.compare(password ?? "", user.password);

    if (!isMatch) {
      return res.render("login", {
        error: "Невірне ім'я користувача або пароль",
        data: req.body,
      });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.redirect("/dashboard");
  },
);

app.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("sessionId");
    res.redirect("/login");
  });
});

////////////////////

app.get(
  "/dashboard",
  requireAuth,
  async (req: Request<{}, {}, {}>, res: Response) => {
    const userId = req.session.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.redirect("/login");
    }

    res.render("dashboard", { username: user.username });
  },
);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).render("404", {
    message: "Сторінку не знайдено",
  });
});

// Error Handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).render("error");
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
