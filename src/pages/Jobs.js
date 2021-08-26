import React from "react";
import Timeline from "../components/Timeline";

// Job descriptions are static markdown documents in the assets folder.
import macsMD from "../assets/jobs/macs.md";
import johnsMD from "../assets/jobs/stjohns.md";
import niwaMD from "../assets/jobs/niwa.md";
import chamberMD from "../assets/jobs/chamber.md";
import tutorMD from "../assets/jobs/tutor.md";

const jobs = [tutorMD, chamberMD, niwaMD, johnsMD, macsMD];

const Jobs = () => <Timeline title="Jobs" events={jobs} />;

export default Jobs;
