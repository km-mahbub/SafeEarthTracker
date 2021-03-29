import React from "react";
import "./loader.css";

interface LoaderProps {
  loading: boolean;
}

export const Loader: React.FC<LoaderProps> = (props) => {
  return (
    <div className="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
