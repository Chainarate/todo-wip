import { Response } from "express";

import { IRepositoryUser } from "../repositories/user";
import { compareHash, hashPassword } from "../auth/bcrypt";
import { AppRequest, Empty, IHandlerUser, WithUser } from ".";

export function newHandlerUser(repo: IRepositoryUser): IHandlerUser {
  return new HandlerUser(repo);
}

class HandlerUser implements IHandlerUser {
  private repo: IRepositoryUser;

  constructor(repo: IRepositoryUser) {
    this.repo = repo;
  }

  async register(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "missing username or password in body" });
    }

    return this.repo
      .createUser({ username, password: hashPassword(password) })
      .then((newUser) => res.status(201).json(newUser).end())
      .catch((err) => {
        const errMsg = `failed to create user ${username}`;
        console.error(`${errMsg}: ${err}`);

        return res.status(500).json({ error: errMsg }).end();
      });
  }

  async login(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "missing username or password in body" });
    }

    return this.repo
      .getUserByUsername(username)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: `no such user: ${username}` });
        }

        if (!compareHash(password, user.password)) {
          return res.status(401).json({ error: `invalid credentail` });
        }

        return res.status(200).json({ status: `user ${username} logged in` });
      })
      .catch((err) => {
        const errMsg = `failed to get user ${username}`;
        console.error(`${errMsg}: ${err}`);

        return res
          .status(500)
          .json({ error: `failed to login user ${username}` });
      });
  }
}
