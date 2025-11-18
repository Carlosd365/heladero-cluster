import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/Router";
import { Toaster } from "react-hot-toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>

    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3500,

        style: {
          background: "#ffffff",
          border: "1px solid #fadadd",    
          color: "#8d425a",                
          padding: "14px 18px",
          borderRadius: "12px",
          fontSize: "0.9rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          fontFamily: "inherit",
          maxWidth: "450px",
          width: "100%",
        },

        success: {
          iconTheme: {
            primary: "#c85a7c",       
            secondary: "#ffe9f0",    
          },
          style: {
            borderLeft: "5px solid #c85a7c",
            background: "#fff6fa",
            color: "#c85a7c",
          },
        },

        error: {
          iconTheme: {
            primary: "#b91c1c",     
            secondary: "#ffecec",
          },
          style: {
            borderLeft: "5px solid #b91c1c",
            background: "#fff5f5",
            color: "#b91c1c",
          },
        },
      }}
    />


    <AppRouter />
  </React.StrictMode>
);
