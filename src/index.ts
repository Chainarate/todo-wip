import { PrismaClient } from "@prisma/client";
import express from "express";

import { newRepositoryTodo } from "./repositories/todo";
import { newRepositoryUser } from "./repositories/user";

import { newHandlerTodo } from "./handlers/todo";
import { newHandlerUser } from "./handlers/user";

const db = new PrismaClient();

async function main() {
  const repoUser = newRepositoryUser(db);
  const handlerUser = newHandlerUser(repoUser);
  const repoTodo = newRepositoryTodo(db);
  const handlerTodo = newHandlerTodo(repoTodo);

  const port = process.env.PORT || 8000;
  const server = express();
  const userRouter = express.Router();
  const todoRouter = express.Router();

  server.use(express.json());
  server.use("/user", userRouter);
  server.use("/todo", todoRouter);

  // Check server status
  server.get("/", (_, res) => {
    return res.status(200).json({ status: "ok" }).end();
  });

  // User API
  userRouter.post("/register", handlerUser.register.bind(handlerUser));
  userRouter.post("/login", handlerUser.login.bind(handlerUser));

  // To-do API
  todoRouter.post("/", handlerTodo.createTodo.bind(handlerTodo));
  todoRouter.get("/", handlerTodo.getTodos.bind(handlerTodo));
  todoRouter.get("/:id", handlerTodo.getTodo.bind(handlerTodo));
  // Guard invalid path for missing `id`
  todoRouter.post("/update", async (_, res) => {
    return res.status(400).json({ error: "missing params id" }).end();
  });
  todoRouter.post("/update/:id", handlerTodo.updateTodo.bind(handlerTodo));
  todoRouter.delete("/", handlerTodo.deleteTodos.bind(handlerTodo));
  todoRouter.delete("/:id", handlerTodo.deleteTodo.bind(handlerTodo));

  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();

main()
  .then(async () => {
    await db.$disconnect();
    console.log("db connection closed");
  })
  .catch(async (err) => {
    console.error(`error in main: ${err}`);
    await db.$disconnect();
    console.log("db connection closed");
  });
