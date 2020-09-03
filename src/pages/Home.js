import Markdown from "../components/Markdown";
import React from "react";
import home from "../assets/home.md";

const Home = () => {
  return <Markdown markdown={home} />;
};

export default Home;
