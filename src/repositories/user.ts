import { PrismaClient } from "@prisma/client";
import { ICreateUser, IUser } from "../entities";

export interface IRepositoryUser {
  createUser(user: ICreateUser): Promise<IUser>;
  getUserByUsername(username: string): Promise<IUser | null>;
}

export function newRepositoryUser(): IRepositoryUser {
  return new RepositoryUserMap();
}

class RepositoryUserMap {
  private m: Map<string, IUser>;
  private id: number;

  constructor() {
    this.m = new Map();
  }

  createUser(user: ICreateUser): Promise<IUser> {
    const newUser = { ...user, id: this.id };
    this.m.set(user.username, newUser);
    this.id++;

    return Promise.resolve(newUser);
  }

  getUserByUsername(username: string): Promise<IUser | null> {
    return Promise.resolve(this.m.get(username) || null);
  }
}

class RepositoryUserPG {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async foo(): Promise<number> {
    return 1; // Promise.resolve(1)
  }

  async createUser(user: ICreateUser): Promise<IUser> {
    return await this.db.user.create({
      data: user,
    });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await this.db.user.findUnique({ where: { username } });
  }
}
