import { isEmpty, transform } from "lodash";
import getUserId from "./get-user-id.server";

type Payload = Record<string, string | File | null>;

interface ReturnValue {
  payload: Payload;
  userId: number | null;
}

export default async function (request: Request): Promise<ReturnValue> {
  const userId = await getUserId(request);

  const formData = Object.fromEntries(await request.formData());

  const initialPayload: Payload = {};

  const payload = transform(
    formData,
    (result, value, key) => {
      result[key] = isEmpty(value) ? null : value;
    },
    initialPayload
  );

  return { payload, userId };
}
