/**
 * App component - App.js
 * ======================
 *
 * This component is the main entry point of the application.
 * It serves the Hash Router, which is used to navigate between
 * the different pages of the application.
 * By default, the application starts on the Map page. It is nice
 * and interactive. And demonstrates GIS knowledge and expertise.
 */

import "./App.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Map from "./pages/Map";
import Dice from "./components/Dice";
import Timeline from "./pages/Timeline";
import AJCAI from "./pages/AJCAI";

const App = () => {
  return (
    <div className="App">
      {/* Center Provider keeps track of a global variable of the center of the map. */}
      <Router>
        <Route component={Map} exact path={"/:id?"} />
        <Route component={Timeline} exact path={"/timeline/:id?"} />
        <Route component={Dice} exact path={"/dice"} />
        <Route component={AJCAI} exact path={"/AJCAI"} />
      </Router>
    </div>
  );
};

export default App;
