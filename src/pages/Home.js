import React from "react";
import Markdown from "../components/Markdown";
import home from "../assets/home.md";
import "../style.css";

const Home = () => {
  return (
    <div className="content twitter-style-border">
      <div className="">
        <Markdown markdown={home} />
      </div>
    </div>
  );
};

export default Home;
