import React from "react";
import { withMarkdown } from "../util/Markdown";
import MacsMD from "../constants/jobs/macs.md";
import NiwaMD from "../constants/jobs/niwa.md";
import JohnsMD from "../constants/jobs/stjohns.md";

const jobs = [
  withMarkdown(MacsMD),
  withMarkdown(JohnsMD),
  withMarkdown(NiwaMD)
];

const Jobs = () => (
  <>
    <h1>Jobs</h1>
    <div class="timeline">
      {jobs.reverse().map((j, i) => {
        return <JobItem Job={j} i={i} />;
      })}
    </div>
  </>
);

const JobItem = ({ Job, i }) => {
  const side = i % 2 ? "right" : "left";
  return (
    <div class={"timeline-container " + side}>
      <div class="timeline-content twitter-style-border">
        <Job></Job>
      </div>
    </div>
  );
};

export default Jobs;
