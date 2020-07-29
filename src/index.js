import React from "react";
import { render } from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import FirebaseProvider from "./api/context";

render(
  <FirebaseProvider>
    <App />
  </FirebaseProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
