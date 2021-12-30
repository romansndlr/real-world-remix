import * as React from "react";
import { Form, useTransition } from "remix";
import ErrorMessages from "./error-messages";
import TagsInput from "./tags-input";

const ArticleForm: React.FC<{
  errors?: Record<string, string | string[]>;
  defaultValues?: {
    title?: string;
    description?: string;
    body?: string;
    tags?: string | string[];
  };
}> = ({ errors, defaultValues }) => {
  const { submission } = useTransition();

  return (
    <>
      <ErrorMessages errors={errors} />
      <Form method="post">
        <fieldset disabled={!!submission}>
          <fieldset className="form-group">
            <input
              defaultValue={defaultValues?.title}
              name="title"
              type="text"
              className="form-control form-control-lg"
              placeholder="Article Title"
            />
          </fieldset>
          <fieldset className="form-group">
            <input
              defaultValue={defaultValues?.description}
              name="description"
              type="text"
              className="form-control"
              placeholder="What's this article about?"
            />
          </fieldset>
          <fieldset className="form-group">
            <textarea
              defaultValue={defaultValues?.body}
              name="body"
              className="form-control"
              rows={8}
              placeholder="Write your article (in markdown)"
            ></textarea>
          </fieldset>
          <fieldset className="form-group">
            <TagsInput name="tags" defaultValue={defaultValues?.tags} />
          </fieldset>
          <button
            className="btn btn-lg pull-xs-right btn-primary"
            type="submit"
          >
            Publish Article
          </button>
        </fieldset>
      </Form>
    </>
  );
};

export default ArticleForm;
