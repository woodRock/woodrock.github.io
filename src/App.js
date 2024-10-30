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
import GoBoard from "./pages/Go";
import DigitClassifier from "./pages/Neural";
import LorenzAttractor from "./pages/Lorzenz";
import ChessBoard from "./pages/Chess";
import Timeline from "./pages/Timeline";
import AJCAI_2022 from "./pages/AJCAI_2022";
import AJCAI_2024 from "./pages/AJCAI_2024";
import Faslip from "./pages/Faslip";
import IEEE_Symposium_2024 from "./pages/IEEE_Symposium_2024";
import Proposal from "./pages/proposal";
import Graph from "./pages/graph";
import LindaLeeWood from "./pages/LindaLeeWood";
import IEEE_AGM from "./pages/ieee_agm";


const App = () => {
  return (
    <div className="App">
      {/* Center Provider keeps track of a global variable of the center of the map. */}
      <Router>
        {/* Important for this route path to be above optional map route. */}
        <Route component={AJCAI_2024} exact path={"/AJCAI_2024"} />
        <Route component={IEEE_Symposium_2024} exact path={"/IEEE_Symposium_2024"} />
        <Route component={AJCAI_2022} exact path={"/AJCAI_2022"} />
        <Route component={Proposal} exact path={"/proposal"} />
        <Route component={Graph} exact path={"/graph"} />
        <Route component={LindaLeeWood} exact path={"/LindaLeeWood"} />
        <Route component={IEEE_AGM} exact path={"/IEEE_AGM"} />
        <Route component={Faslip} exact path={"/FASLIP"} />
        <Route component={Map} exact path={"/"} />
        <Route component={Map} exact path={"/map/:id?"} />
        <Route component={Timeline} exact path={"/timeline/:id?"} />
        <Route component={DigitClassifier} exact path={"/neural"} />
        <Route component={LorenzAttractor} exact path={"/lorenz"} />
        <Route component={NeuralNet} exact path={"/neural"} />
        <Route component={Dice} exact path={"/dice"} />
        <Route component={GoBoard} exact path={"/go"} />
        <Route component={ChessBoard} exact path={"/chess"} />
      </Router>
    </div>
  );
};

export default App;
