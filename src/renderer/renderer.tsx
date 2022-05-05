import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/App";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB8j12LmUfpHInqywSgaIRtavlXtz6r5wc",
  authDomain: "sentence-base.firebaseapp.com",
  projectId: "sentence-base",
  storageBucket: "sentence-base.appspot.com",
  messagingSenderId: "890176304594",
  appId: "1:890176304594:web:aac4537596f6ae2dcfc40b",
  measurementId: "G-8YD0VS28Q8",
};

const element = document.getElementById("root");

if (!element) {
  throw new Error("Root element doesn't exist.");
}

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(element);
root.render(<App />);
