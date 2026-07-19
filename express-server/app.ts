import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));

// // Налаштування multer
// const upload = multer({ dest: "uploads/" });

// app.post("/upload", upload.single("avatar"), (req: Request, res: Response) => {
//   console.log("Текстові дані:", req.body);
//   console.log("Файл:", req.file);
//   res.send("Файл завантажено!");
// });
const PORT = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello from Docker!" });
});
app.listen(PORT, () => {
  console.log(`Server is running on <http://localhost:${PORT}>`);
});
