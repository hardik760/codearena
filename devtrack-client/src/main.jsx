import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#111120",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          fontSize: "14px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#a78bfa", secondary: "#111120" },
        },
        error: {
          iconTheme: { primary: "#f87171", secondary: "#111120" },
        },
      }}
    />
  </BrowserRouter>
);