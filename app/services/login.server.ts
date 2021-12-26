import bcrypt from "bcrypt";
import { db, ValidationError } from "../utils";

interface LoginForm {
  email: string;
  password: string;
}

export default async function login({ email, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ValidationError({
      email: [`Can't find user with the email: ${email}`],
    });
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    throw new ValidationError({
      email: ["Incorrect password"],
    });
  }

  return user;
}
