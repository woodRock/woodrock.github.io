import React from "react";
import Markdown from "./Markdown";
import { v4 } from "uuid";
import "./Timeline.css";

const Timeline = ({ title, events }) => (
  <div>
    <h1>{title}</h1>
    <hr />
    <div className="timeline">
      {events.map((file, i) => {
        return <Event key={v4()} file={file} i={i} />;
      })}
    </div>
  </div>
);

const Event = ({ file, i }) => {
  const side = i % 2 ? "right" : "left";
  return (
    <div className={"timeline-container " + side}>
      <div className="timeline-content twitter-style-border">
        <Markdown markdown={file} />
      </div>
    </div>
  );
};

export default Timeline;
