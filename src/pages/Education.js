import Timeline from "../components/Timeline";
import React from "react";
import ibsMD from "../assets/schools/ibs.md";
import swisMD from "../assets/schools/swis.md";
import rcMD from "../assets/schools/rc.md";
import vuwMD from "../assets/schools/vuw.md";

const schools = [vuwMD, rcMD, swisMD, ibsMD];

const Education = () => {
  return (
    <div style={styles.container} className="twitter-style-border">
      <div style={styles.content}>
        <Timeline title="Education" events={schools} />;
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "60%",
    minHeight: "100vh"
  },
  content: {
    padding: "2.5rem"
  }
};

export default Education;
