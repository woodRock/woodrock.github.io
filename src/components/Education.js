import React from "react";
import ibsMD from "../constants/schools/ibs.md";
import swisMD from "../constants/schools/swis.md";
import rcMD from "../constants/schools/rc.md";
import vuwMD from "../constants/schools/vuw.md";
import { withMarkdown } from "../util/Markdown";

const schools = [
  withMarkdown(ibsMD),
  withMarkdown(swisMD),
  withMarkdown(rcMD),
  withMarkdown(vuwMD)
];

const Education = () => (
  <div>
    <h1>Education</h1>
    <div class="timeline">
      {schools.reverse().map((school, i) => {
        return <SchoolItem School={school} i={i} />;
      })}
    </div>
  </div>
);

const SchoolItem = ({ School, i }) => {
  const side = i % 2 ? "right" : "left";
  return (
    <div class={"timeline-container " + side}>
      <div class="timeline-content twitter-style-border">
        <School />
      </div>
    </div>
  );
};

export default Education;
