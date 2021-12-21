import * as React from "react";

const Alert: React.FC = ({ children }) => {
  const [showAlert, setShowAlert] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, []);

  if (!showAlert) return null;

  return (
    <div
      style={{
        backgroundColor: "#b85c5c",
        color: "white",
        textAlign: "center",
        padding: "8px 0",
      }}
      role="alert"
    >
      {children}
    </div>
  );
};

export default Alert;
