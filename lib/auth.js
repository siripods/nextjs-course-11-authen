import { hash } from "bcryptjs";

export async function hashPassword(password) {
  hashedPassword = await hash(password, 12);
  return hashedPassword;
}
