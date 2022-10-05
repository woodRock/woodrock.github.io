/**
 * Timeline page - Timeline.js
 * ===========================
 * 
 * The Timeline displays a chronological list of markers - 
 * that consist of education, work experience and interests.
 * These are the same markers from the Map component, but 
 * instead displayed as a timeline.
 */

import React from "react";
import { markers } from "./Map";
import VTimeline from "../components/Timeline.js";

const Timeline = () => (
  <VTimeline markers={ markers } />
);

export default Timeline;
