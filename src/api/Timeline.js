import React from "react";

const Timeline = ({ title, events }) => (
  <div>
    <h1>{title}</h1>
    <div class="timeline">
      {events.map((event, i) => {
        return <Item Item={event} i={i} />;
      })}
    </div>
  </div>
);

const Item = ({ Item, i }) => {
  const side = i % 2 ? "right" : "left";
  return (
    <div class={"timeline-container " + side}>
      <div class="timeline-content twitter-style-border">
        <Item />
      </div>
    </div>
  );
};

export default Timeline;
