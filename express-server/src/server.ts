import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/api/books", (req: Request, res: Response) => {
  res.send([
    { id: 1, title: "Тіні забутих предків", author: "Михайло Коцюбинський" },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on <http://localhost>:${PORT}`);
});

////////////////////////
// app.use(
//   (
//     req: Request & { requestTime?: string },
//     res: Response,
//     next: NextFunction,
//   ) => {
//     req.requestTime = new Date().toISOString();
//     next();
//   },
// );

// app.get(
//   "/api/books",
//   (req: Request & { requestTime?: string }, res: Response) => {
//     res.json({
//       requestTime: req.requestTime,
//       books: [
//         {
//           id: 1,
//           title: "Тіні забутих предків",
//           author: "Михайло Коцюбинський",
//         },
//       ],
//     });
//   },
// );

// import express, { Request } from "express";

// const app = express();
// const PORT = 3000;

// app.get("/api/books", (req, res) => {
//   res.json([
//     { title: "Тіні забутих предків", author: "Михайло Коцюбинський" },
//     { title: "Захар Беркут", author: "Іван Франко" },
//   ]);
// });

// app.post("/api/books", (req, res) => {
//   res.status(201).json({
//     message: "Book added successfully",
//   });
// });

// app.patch("/api/books", (req, res) => {
//   res.json({
//     message: "Book updated successfully",
//   });
// });

// app.put("/api/books", (req, res) => {
//   res.json({
//     message: "Book replaced successfully",
//   });
// });

// app.delete("/api/books", (req, res) => {
//   res.json({
//     message: "Book deleted successfully",
//   });
// });

// interface Book {
//   id: number;
//   title: string;
//   author: string;
// }

// const books: Book[] = [
//   { id: 1, title: "Тіні забутих предків", author: "Михайло Коцюбинський" },
//   { id: 2, title: "Захар Беркут", author: "Іван Франко" },
//   { id: 3, title: "Кобзар", author: "Тарас Шевченко" },
// ];

// app.get("/api/books/:id", (req: Request<{ id: string }>, res) => {
//   const bookId = req.params.id;
//   const book = books.find((b) => b.id === parseInt(bookId));

//   if (book) {
//     res.json(book);
//   } else {
//     res.status(404).json({ error: "Book not found" });
//   }
// });

// app.get(
//   "/api/authors/:authorId/books/:bookId",
//   (req: Request<{ authorId: string; bookId: string }>, res) => {
//     const authorId = req.params.authorId;
//     const bookId = req.params.bookId;

//     res.json({
//       message: "Requested specific book from specific author",
//       authorId: authorId,
//       bookId: bookId,
//     });
//   },
// );

// app.get("/api/books", (req, res) => {
//   const author = req.query.author as string | undefined;
//   const sortBy = req.query.sortBy as string | undefined;

//   let result = [...books];

//   if (author) {
//     result = result.filter((book) =>
//       book.author.toLowerCase().includes(author.toLowerCase()),
//     );
//   }

//   if (sortBy === "title") {
//     result.sort((a, b) => a.title.localeCompare(b.title));
//   }

//   res.json(result);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on <http://localhost>:${PORT}`);
// });
