import React from "react";
import { render } from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import FirebaseProvider from "./util/context";

render(
  <FirebaseProvider>
    <App />
  </FirebaseProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
