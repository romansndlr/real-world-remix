import bcrypt from "bcrypt";
import { snakeCase } from "lodash";
import * as Yup from "yup";
import { db } from "../utils";

interface RegisterInput {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  username: FormDataEntryValue | null;
}

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string()
    .required()
    .min(6)
    .matches(/[a-zA-Z1-9]/),
  username: Yup.string().required(),
});

export default async function (input: RegisterInput) {
  try {
    const validated = validationSchema.validateSync(input, {
      abortEarly: false,
    });

    const user = await db.user.create({
      data: {
        username: snakeCase(validated.username),
        email: validated.email,
        password: bcrypt.hashSync(validated.password, bcrypt.genSaltSync()),
      },
    });
    console.log("🚀 ~ file: register.server.ts ~ line 34 ~ user", user);

    return { data: user };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return { errors: error.errors };
    }
  }
}
