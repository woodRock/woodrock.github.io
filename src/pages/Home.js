import React from "react";
import Markdown from "../components/Markdown";
import home from "../assets/home.md";
import "../style.css";

const Home = () => {
  return (
    <div className="twitter-style-border">
      <div className="container">
        <Markdown markdown={home} />
      </div>
    </div>
  );
};

export default Home;
