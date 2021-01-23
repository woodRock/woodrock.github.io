import React from "react";
import Markdown from "../components/Markdown";
import skills from "../assets/skills.md";

const Skills = () => {
  return (
    <div className="content twitter-style-border">
      <div>
        <Markdown markdown={skills} />
      </div>
    </div>
  );
};

export default Skills;
