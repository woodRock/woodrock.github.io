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

const Event = ({ file, i }) => (
  <div className={"timeline-container " + side(i)}>
    <div className="timeline-content twitter-style-border">
      <Markdown markdown={file} />
    </div>
  </div>
);

const side = (i) => (i % 2 ? "right" : "left");

export default Timeline;
