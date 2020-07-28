import React from "react";
import { render } from "react-dom";
import App from "./app";
import * as serviceWorker from "./serviceWorker";
import FirebaseProvider from "./app/util/Firebase/context";

render(
  <FirebaseProvider>
    <App />
  </FirebaseProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
