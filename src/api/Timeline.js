import React from "react";
import Markdown from "../api/Markdown";

const Timeline = ({ title, events }) => (
  <div>
    <h1>{title}</h1>
    <div class="timeline">
      {events.map((file, i) => {
        return <Event file={file} i={i} />;
      })}
    </div>
  </div>
);

const Event = ({ file, i }) => {
  const side = i % 2 ? "right" : "left";
  return (
    <div class={"timeline-container " + side}>
      <div class="timeline-content twitter-style-border">
        <Markdown markdown={file} />
      </div>
    </div>
  );
};

export default Timeline;
