import "./App.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Map from "./pages/Map";
import Dice from "./components/Dice";
import Timeline from "./pages/Timeline";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Route
          component={ Map }
          exact
          path={ "/" }
        />
        <Route
          component={ Dice }
          exact
          path={ "/dice" }
        />
        <Route
          component={ Timeline }
          exact
          path={ "/timeline" }
        />
      </Router>
    </div>
  );
};

export default App;
