export interface ICreateUser {
  username: string;
  password: string;
}

export interface IUser extends ICreateUser {
  id: number;
  todos?: ITodo;
}

export interface ITodo {
  id: number;
  msg: string;
  ownerId: number;
}
