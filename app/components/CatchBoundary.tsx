import { useCatch } from "remix";
import Layout from "./Layout";
import Document from "./Document";

const CatchBoundary = () => {
  let caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <div className="container page">
          <h1>
            {caught.status}: {caught.statusText}
          </h1>
          {caught.data}
        </div>
      </Layout>
    </Document>
  );
};

export default CatchBoundary;
