import React from "react";
import Timeline from "../components/Timeline";
import macsMD from "../assets/jobs/macs.md";
import niwaMD from "../assets/jobs/niwa.md";
import johnsMD from "../assets/jobs/stjohns.md";

const jobs = [niwaMD, johnsMD, macsMD];

const Jobs = () => {
  return (
    <div>
      <div>
        <Timeline title="Jobs" events={jobs} />;
      </div>
    </div>
  );
};

export default Jobs;
