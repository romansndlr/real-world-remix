import isObject from "lodash/isObject";
import * as React from "react";

const ErrorMessages: React.FC<{ errors: unknown }> = ({ errors }) => {
  if (!errors) return null;

  return (
    <ul className="error-messages">
      {isObject(errors) &&
        Object.entries(errors).map(([key, value]) => (
          <li key={`${key}-${value}`}>{value}</li>
        ))}
    </ul>
  );
};

export default ErrorMessages;
