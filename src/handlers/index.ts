import { Request, Response } from "express";

// Custom Express `Request` (no Query)
export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export interface Empty {}

export interface WithId {
  id: string;
}

export interface WithMsg {
  msg: string;
}

export interface WithUser {
  username: string;
  password: string;
}

export type HandlerFunc<Req> = (req: Req, res: Response) => Promise<Response>;

export interface IHandlerTodo {
  createTodo: HandlerFunc<AppRequest<Empty, WithMsg>>;
  getTodos: HandlerFunc<AppRequest<Request, any>>;
  getTodo: HandlerFunc<AppRequest<WithId, any>>;
  updateTodo: HandlerFunc<AppRequest<WithId, WithMsg>>;
  deleteTodo: HandlerFunc<AppRequest<WithId, Empty>>;
  deleteTodos: HandlerFunc<Request>;
}

export interface IHandlerUser {
  register: HandlerFunc<AppRequest<Empty, WithUser>>;
  login: HandlerFunc<AppRequest<Empty, WithUser>>;
}
