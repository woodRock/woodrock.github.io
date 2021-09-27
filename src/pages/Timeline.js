import React from "react";
import { markers } from "./Map";
import VTimeline from "../components/Timeline.js";

/**
 * Displays markers from map, instead as a timeline.
 */
const Timeline = () => (
  <VTimeline markers={ markers } />
);

export default Timeline;
