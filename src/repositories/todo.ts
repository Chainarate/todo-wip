import { PrismaClient } from "@prisma/client";
import { ITodo } from "../entities";

export interface IRepositoryTodo {
  createTodo(todo: { msg: string; ownerId: number }): Promise<ITodo>;
  getTodos(): Promise<ITodo[]>;
  getUserTodos(ownerId: number): Promise<ITodo[]>;
  getTodoById(id: number): Promise<ITodo | null>;
  updateTodo(todo: { msg: string; id: number }): Promise<ITodo>;
  deleteTodos(): Promise<number>;
  deleteById(id: number): Promise<ITodo>;
}

export function newRepositoryTodo(db: PrismaClient): IRepositoryTodo {
  return new RepositoryTodo(db);
}

class RepositoryTodo {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createTodo(todo: { msg: string; ownerId: number }): Promise<ITodo> {
    return await this.db.todo.create({
      data: {
        msg: todo.msg,
        owner: {
          connect: {
            id: todo.ownerId,
          },
        },
      },
    });
  }

  async getTodos(): Promise<ITodo[]> {
    return await this.db.todo.findMany();
  }

  async getUserTodos(ownerId: number): Promise<ITodo[]> {
    return await this.db.todo.findMany({ where: { ownerId } });
  }

  async getTodoById(id: number): Promise<ITodo | null> {
    return await this.db.todo.findUnique({ where: { id } });
  }

  async updateTodo(todo: { msg: string; id: number }): Promise<ITodo> {
    return await this.db.todo.update({
      where: { id: todo.id },
      data: { msg: todo.msg },
    });
  }

  async deleteTodos(): Promise<number> {
    const deleted = await this.db.todo.deleteMany();
    return Promise.resolve(deleted.count);
  }

  async deleteById(id: number): Promise<ITodo> {
    return this.db.todo.delete({ where: { id } });
  }
}
