import React from "react";
import {render} from "react-dom";
import App from "./app/App";
import * as serviceWorker from "./serviceWorker";
import FirebaseProvider from "./app/util/context";

render(
  <FirebaseProvider>
    <App />
  </FirebaseProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
