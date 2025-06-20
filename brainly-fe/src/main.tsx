import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <React.StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </React.StrictMode>
  </ThemeProvider>
);
