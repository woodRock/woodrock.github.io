/**
 * Timeline component - Timeline.js
 * ================================
 *
 * A vertical timeline from the interwebs (source: https://bit.ly/3AJfrmk).
 */

import React from "react";
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
import { Link } from "react-router-dom";
import { useCenter } from "../api/center";

/**
 * @param {markers} param0 a collection of locations with information - see {@link Timeline} for more information.
 */
const VTimeline = ({ markers }) => {
  const { updateCenter } = useCenter();

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

VTimeline.propTypes = {
  markers: propTypes.array.isRequired,
};

export default VTimeline;
export { HomeButton };
