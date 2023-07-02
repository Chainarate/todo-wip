import bcryptjs from "bcryptjs";

export function hashPassword(password: string): string {
  const salt = bcryptjs.genSaltSync(12);

  return bcryptjs.hashSync(password, salt);
}

export function compareHash(password: string, hashed: string): boolean {
  console.log(password);
  console.log(hashed);
  return bcryptjs.compareSync(password, hashed);
}

const password = "1234";
const passworded = "1234";
const hash = hashPassword(password);
const hashed = hashPassword(passworded);

// console.log(hash);
// console.log(hashed);

console.log(compareHash("1234", hash));
console.log(compareHash("1234", hashed));
