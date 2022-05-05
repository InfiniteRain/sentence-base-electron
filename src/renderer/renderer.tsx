import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/App";

const element = document.getElementById("root");

if (!element) {
  throw new Error("Root element doesn't exist.");
}

const root = ReactDOM.createRoot(element);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
