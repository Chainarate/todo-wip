import express from "express";

import { newHandlerUser } from "./handlers/user";
import { newRepositoryUser } from "./repositories/user";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
async function main() {
  const repoUser = newRepositoryUser();
  const handlerUser = newHandlerUser(repoUser);

  const server = express();
  const userRouter = express.Router();

  server.use("/user", userRouter);

  userRouter.post("/register", handlerUser.register.bind(handlerUser));
  userRouter.post("/login", handlerUser.login.bind(handlerUser));

  server.listen(8000, () => {
    console.log(`server listening at port 8000`);
  });
}

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
