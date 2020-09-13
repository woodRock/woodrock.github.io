import React from "react";
import Markdown from "../components/Markdown";
import home from "../assets/home.md";
import "../style.css";

const Home = () => {
  return (
    <div className="main">
      <Markdown markdown={home} />
    </div>
  );
};

export default Home;
