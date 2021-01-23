import React from "react";
import Timeline from "../components/Timeline";
import macsMD from "../assets/jobs/macs.md";
import niwaMD from "../assets/jobs/niwa.md";
import johnsMD from "../assets/jobs/stjohns.md";

const jobs = [niwaMD, johnsMD, macsMD];

const Jobs = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Timeline title="Jobs" events={jobs} />;
      </div>
    </div>
  );
};

const styles = {
  container: {
    // width: "60%",
    minHeight: "100vh",
  },
  content: {
    padding: "2.5rem",
  },
};

export default Jobs;
