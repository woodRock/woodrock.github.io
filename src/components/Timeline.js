/**
 * Timeline component - Timeline.js
 * ================================
 *
 * A vertical timeline from the interwebs (source: https://bit.ly/3AJfrmk).
 */

import React, { createRef, useEffect } from "react";
import propTypes from "prop-types";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import "./Timeline.css";
import { colors } from "./MarkerMap";

import EducationIcon from "../assets/education.png";
import WorkIcon from "../assets/work.png";
import MapIcon from "../assets/map_pin.png";
import { HomeButton, Icon } from "./Buttons";
import { Link, useParams } from "react-router-dom";
import { useCenter } from "../api/center";

/**
 * The timeline component displays a vertical timeline of events.
 * It can scroll to a specific event, or display all events.
 * Also, when the Map button is clicked, it will center the map on the event.
 *
 * @param {markers} param0 a collection of locations with information - see {@link Timeline} for more information.
 */
const VTimeline = ({ markers }) => {
  // We use this to update the center of the map when the Map Icon is clicked.
  const { updateCenter } = useCenter();

  // The id is the date of the event, this is used to scroll to the correct event.
  const { id } = useParams();
  // This stores a reference to the event that is currently selected.
  const myRef = createRef(null);
  // Scrolls to the selected event.
  useEffect(() => {
    // Scroll to selected event.
    myRef.current.scrollIntoView();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="bg-image">
        <VerticalTimeline className={"timeline"}>
          <HomeButton />
          {markers.map(({ name, position, url, type, date, image }, index) => (
            <VerticalTimelineElement
              className={
                type === "work"
                  ? "vertical-timeline-element--work"
                  : "vertical-timeline-element--education"
              }
              date={date}
              icon={
                type === "work" ? (
                  <Icon source={WorkIcon} />
                ) : (
                  <Icon source={EducationIcon} />
                )
              }
              iconStyle={{ background: colors[type], color: "#fff" }}
              key={index}
            >
              {/* Scroll to the selected event on the timeline. */}
              {id === date && <div ref={myRef} />}
              <h3 className="vertical-timeline-element-title">{name}</h3>
              <h4 className="vertical-timeline-element-subtitle">{type}</h4>
              <img src={image} alt={name} style={{ width: "10rem" }} />
              <p>
                {/* Links to map, setting its center at current timeline event. */}
                <Link to={"/"} onClick={() => updateCenter(position)}>
                  Find on map...
                  <img
                    src={MapIcon}
                    alt="Map Icon"
                    style={{ width: "2rem", height: "2rem" }}
                  />
                </Link>
              </p>
              <p>
                <a href={url}> See More...</a>
              </p>
            </VerticalTimelineElement>
          ))}
          <HomeButton />
        </VerticalTimeline>
      </div>
    </>
  );
};

VTimeline.propTypes = {
  markers: propTypes.array.isRequired,
};

export default VTimeline;
export { HomeButton };
