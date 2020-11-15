import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import { useThemeState } from "./api/Theme";
import ROUTES from "./constants/routes";
import "./style.css";

const App = () => {
  const state = useThemeState();
  return (
    <body className={state.theme}>
      <Router>
        <Navigation />
        <main>
          <Pages />
        </main>
      </Router>
    </body>
  );
};

const Pages = () => {
  return (
    <>
      {ROUTES.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          exact
          component={route.component}
        />
      ))}
    </>
  );
};

export default App;
