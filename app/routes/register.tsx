import {
  ActionFunction,
  Form,
  useTransition,
  json,
  useActionData,
} from "remix";
import { ErrorMessages } from "~/components";
import { register } from "~/services";
import { createSession } from "~/utils";

interface RegisterAction {
  errors?: Record<string, string[]>;
  values?: {
    username: string;
    email: string;
    password: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const { username, email, password } = Object.fromEntries(
    await request.formData()
  );

  const values = { username, email, password };

  const result = await register(values);

  if (result?.data) {
    createSession(result.data.id);
  }

  if (result?.errors) {
    return json({ errors: result.errors, values });
  }
};

export default function Register() {
  const actionData = useActionData<RegisterAction>();
  const { submission } = useTransition();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="">Have an account?</a>
            </p>
            <ErrorMessages errors={actionData?.errors} />
            <Form method="post" reloadDocument>
              <fieldset disabled={!!submission}>
                <fieldset className="form-group">
                  <input
                    defaultValue={actionData?.values?.username}
                    name="username"
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    defaultValue={actionData?.values?.email}
                    name="email"
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    defaultValue={actionData?.values?.password}
                    name="password"
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">
                  Sign up
                </button>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
