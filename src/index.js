import React from "react";
import { render } from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import FirebaseProvider from "./api/context";
import ThemeProvider from "./api/Theme";
import "./style.css";

render(
  <FirebaseProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </FirebaseProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
