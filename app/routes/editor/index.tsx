import { ActionFunction, Form, redirect, useTransition } from "remix";
import { TagsInput } from "~/components";
import { db, getSession } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const body = formData.get("body") as string;
  const tags = formData.get("tags") as string;

  const article = await db.article.create({
    data: {
      title,
      description,
      body,
      author: {
        connect: {
          id: userId,
        },
      },
      tags: {
        connectOrCreate: tags.split(",").map((tag) => ({
          create: {
            name: tag,
          },
          where: {
            name: tag,
          },
        })),
      },
    },
  });

  return redirect(`/article/${article.id}`);
};

const Editor = () => {
  const { submission } = useTransition();

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <Form method="post">
              <fieldset disabled={!!submission}>
                <fieldset className="form-group">
                  <input
                    name="title"
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    name="description"
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    name="body"
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <TagsInput name="tags" />
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                >
                  Publish Article
                </button>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
