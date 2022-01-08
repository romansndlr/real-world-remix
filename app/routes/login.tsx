import { ActionFunction, Form, json, useActionData, useTransition } from "remix";
import { ErrorMessages } from "~/components";
import { login } from "~/utils";
import { createSession } from "~/utils";

interface LoginAction {
  errors: Record<string, string[]>;
  values: {
    email: string;
    password: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const { email, password } = Object.fromEntries(await request.formData());

  const result = await login({ email, password });

  if (result?.data) {
    await createSession(result.data.id);
  }

  if (result?.errors) {
    return json({ errors: result.errors, values: { email, password } });
  }
};

export default function Login() {
  const actionData = useActionData<LoginAction>();
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
            <ErrorMessages errors={actionData?.errors} />
            <Form method="post" reloadDocument>
              <fieldset disabled={!!submission}>
                <fieldset className="form-group">
                  <input
                    defaultValue={actionData?.values.email}
                    name="email"
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    defaultValue={actionData?.values.password}
                    name="password"
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                  />
                </fieldset>
                <button type="submit" className="btn btn-lg btn-primary pull-xs-right">
                  Sign in
                </button>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
