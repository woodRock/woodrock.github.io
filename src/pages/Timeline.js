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
import { useParams } from "react-router-dom";
import { markers } from "./Map";
import VTimeline from "../components/Timeline.js";

const Timeline = () => {
  // The id is the name of the marker that is selected.
  const { id } = useParams();
  return <VTimeline markers={markers} id={id} />;
};

export default Timeline;
