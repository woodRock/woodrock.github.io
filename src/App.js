import React from "react";
import { HashRouter, Route } from "react-router-dom";
import ROUTES from "./constants/routes";
import SocialPage from "./components/Social";
import Navigation from "./components/Navigation";
import CopyRight from "./components/Copyright";
import "./style.css";
import { useThemeState } from "./api/Theme";

const App = () => {
  const state = useThemeState();
  return (
    <body className={state.theme}>
      <HashRouter>
        <Navigation />
        <main>
          <Actual />
        </main>
      </HashRouter>
    </body>
  );
};

const Header = () => <div className="navigation twitter-style-border"></div>;

const Container = () => (
  <div className="main">
    <h1>test</h1>
  </div>
);

function Actual() {
  return (
    <div className="">
      {ROUTES.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          exact
          component={route.component}
        />
      ))}
    </div>
  );
}

const Footer = () => (
  <div className="main">
    <SocialPage />
    <CopyRight />
  </div>
);

export default App;
