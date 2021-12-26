import {
  ActionFunction,
  Form,
  json,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import * as Yup from "yup";
import { ErrorMessages } from "~/components";
import { login } from "~/services";
import { commitSession, getSession, ValidationError } from "~/utils";

interface LoginAction {
  errors: unknown;
  values: {
    email: string;
    password: string;
  };
}

let validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string()
    .required()
    .min(6)
    .matches(/[a-zA-Z1-9]/),
});

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession();

  const form = await request.formData();

  const email = form.get("email") as string;
  const password = form.get("password") as string;

  try {
    validationSchema.validateSync({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return json({
        errors: error.errors,
        values: {
          email,
          password,
        },
      });
    }
  }

  try {
    const user = await login({ email, password });

    session.set("userId", user.id);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return json({
        errors: error.errors,
        values: {
          email,
          password,
        },
      });
    }
  }
};

export default function Login() {
  const data = useActionData<LoginAction>();
  const { submission } = useTransition();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="">Need an account?</a>
            </p>
            <ErrorMessages errors={data?.errors} />
            <Form method="post" action="/login">
              <fieldset className="form-group" disabled={!!submission}>
                <input
                  defaultValue={data?.values.email}
                  name="email"
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset className="form-group" disabled={!!submission}>
                <input
                  defaultValue={data?.values.password}
                  name="password"
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  required
                />
              </fieldset>
              <button
                disabled={!!submission}
                type="submit"
                className="btn btn-lg btn-primary pull-xs-right"
              >
                Sign in
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
