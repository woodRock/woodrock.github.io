import React from "react";
import { HashRouter, Route } from "react-router-dom";
import ROUTES from "./constants/routes";
import SocialPage from "./components/Social";
import Navigation from "./components/Navigation";
import CopyRight from "./components/Copyright";
import "./index.css";

const App = () => (
  <HashRouter>
    <Header />
    <Container />
    <Footer />
  </HashRouter>
);

const Header = () => (
  <div className="navigation twitter-style-border">
    <Navigation />
  </div>
);

const Container = () => (
  <div className="container twitter-style-border">
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
  </div>
);

const Footer = () => (
  <>
    <SocialPage />
    <CopyRight />
  </>
);

export default App;
