import { Request, Response } from "express";

import { IRepositoryTodo } from "../repositories/todo";
import { IHandlerTodo, AppRequest, WithId, WithMsg } from ".";

export function newHandlerTodo(repoTodo: IRepositoryTodo): IHandlerTodo {
  return new HandlerTodo(repoTodo);
}

class HandlerTodo implements IHandlerTodo {
  private repo: IRepositoryTodo;

  constructor(repo: IRepositoryTodo) {
    this.repo = repo;
  }

  async createTodo(req: Request, res: Response): Promise<Response> {
    const { msg } = req.body;
    if (!msg) {
      return res.status(400).json({ error: "missing msg in json body" }).end();
    }

    return this.repo
      .createTodo(msg)
      .then((todo) => res.status(201).json(todo).end())
      .catch((err) => {
        console.error(`failed to create todo: ${err}`);
        return res.status(500).json({ error: `failed to create todo` }).end();
      });
  }

  async getTodos(_, res: Response): Promise<Response> {
    return this.repo
      .getTodos()
      .then((todos) => res.status(200).json(todos).end())
      .catch((err) => {
        console.error(`failed to create todo: ${err}`);
        return res.status(500).json({ error: `failed to create todo` }).end();
      });
  }

  async getTodo(
    req: AppRequest<WithId, WithMsg>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);
    // isNaN checks if its arg is NaN
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    return this.repo
      .getTodoById(id)
      .then((todo) => {
        if (!todo) {
          return res
            .status(404)
            .json({ error: `no such todo: ${id}` })
            .end();
        }

        return res.status(200).json(todo).end();
      })
      .catch((err) => {
        const errMsg = `failed to get todo ${id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg });
      });
  }

  async updateTodo(
    req: AppRequest<WithId, WithMsg>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);
    // isNaN checks if its arg is NaN
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }
    const { msg } = req.body;

    if (!msg) {
      return res.status(400).json({ error: "missing msg in json body" }).end();
    }

    return this.repo
      .updateTodo({ id, msg })
      .then((updated) => res.status(201).json(updated).end())
      .catch((err) => {
        const errMsg = `failed to update todo ${id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg }).end();
      });
  }

  async deleteTodo(
    req: Request<WithId, WithMsg>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);
    // isNaN checks if its arg is NaN
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    return this.repo
      .deleteById(id)
      .then((deleted) => res.status(200).json(deleted).end())
      .catch((err) => {
        console.error(`failed to delete todo ${id}: ${err}`);
        return res.status(500).json({ error: `failed to delete todo ${id}` });
      });
  }

  async deleteTodos(_, res: Response): Promise<Response> {
    return this.repo
      .deleteTodos()
      .then(() =>
        res.status(200).json({ status: "todos cleared successfully" })
      )
      .catch((err) => {
        console.error(`failed to clear todos: ${err}`);
        return res.status(500).json({ error: "failed to clear todos" }).end();
      });
  }
}
