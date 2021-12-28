import * as React from "react";
import Document from "./document";
import Layout from "./layout";

const ErrorBoundary: React.FC<{ error: Error }> = ({ error }) => {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div className="container page">
          <h1>There was an error</h1>
          <p>{error.message}</p>
        </div>
      </Layout>
    </Document>
  );
};

export default ErrorBoundary;
