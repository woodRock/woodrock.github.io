import Timeline from "../components/Timeline";
import React from "react";
import ibsMD from "../assets/schools/ibs.md";
import swisMD from "../assets/schools/swis.md";
import rcMD from "../assets/schools/rc.md";
import vuwMD from "../assets/schools/vuw.md";

const schools = [vuwMD, rcMD, swisMD, ibsMD];

const Education = () => {
  return (
    <div className="content">
      <div>
        <Timeline title="Education" events={schools} />;
      </div>
    </div>
  );
};

export default Education;
