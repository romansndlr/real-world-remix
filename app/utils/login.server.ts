import bcrypt from "bcrypt";
import * as Yup from "yup";
import db from "./db.server";
import ValidationError from "./validation-error";

interface LoginInput {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

let validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string()
    .required()
    .min(6)
    .matches(/[a-zA-Z1-9]/),
});

export default async function (input: LoginInput) {
  try {
    const validated = validationSchema.validateSync(input, {
      abortEarly: false,
    });

    const user = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      throw new ValidationError({
        email: [`Can't find user with the email: ${validated.email}`],
      });
    }

    const isCorrectPassword = await bcrypt.compare(validated.password, user.password);

    if (!isCorrectPassword) {
      throw new ValidationError({
        email: ["Incorrect password"],
      });
    }

    return { data: user };
  } catch (error) {
    if (error instanceof Yup.ValidationError || error instanceof ValidationError) {
      return { errors: error.errors };
    }

    console.error(error);
  }
}
