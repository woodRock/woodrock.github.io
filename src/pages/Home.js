import React from "react";
import Markdown from "../components/Markdown";
import home from "../assets/home.md";
import "../style.css";

const Home = () => {
  return <Markdown markdown={home} />;
};

export default Home;
