import { useHistory } from "react-router-dom";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import propTypes from "prop-types";
import { useCenter } from "../api/center";
import Home from "../assets/home.png";

/**
 * Icon for the Home button, returns user home.
 * @returns {React.Component} a button to return to the home page.
 */
const HomeButton = () => {
  const history = useHistory();
  const { reset } = useCenter();

  function home() {
    // Ensures that the map is centered on Wellington.
    reset();
    history.push("/");
  }

  return (
    <VerticalTimelineElement
      icon={<Icon source={Home} />}
      iconOnClick={() => home()}
      iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
    />
  );
};

/**
 * An icon displayed at the center of the timeline.
 * @param {source} param0 an image source that has been imported.
 */
const Icon = ({ source }) => (
  <img
    src={source}
    alt={"icon"}
    style={{
      maxWidth: "100%",
      bottom: "100px",
      borderRadius: "50%",
    }}
  />
);

Icon.propTypes = {
  source: propTypes.string.isRequired,
};

export { HomeButton, Icon };
