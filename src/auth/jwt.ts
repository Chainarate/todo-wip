import jwt from "jsonwebtoken";

export interface Payload {
  userId: number;
  username: string;
}

export function newJwt(secrete: string, data: Payload): string {
  return jwt.sign(data, secrete, {
    algorithm: "HS512",
    expiresIn: "12h",
    issuer: "todo-api",
    subject: "user-login",
    audience: "user",
  });
}
