/**
 * MarkerMap component - MarkerMap.js
 * ==================================
 *
 * The MarkerMap component displays a map with a set of markers at a given location.
 * A marker is defined in the [MapMarker]{@link MapMarker} component.
 * This displays a map using the [Leaflet js]{@link https://leafletjs.com/} library.
 * The main purpose of this class to allow for custom icons on the leaflet map.
 * The library doesn't easily support this, so solutions are hacky at best.
 */

import React, { useEffect } from "react";
import {
  Circle,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent,
  useMap,
} from "react-leaflet";
import { Link } from "react-router-dom";
import { useCenter } from "../api/center";
import PropTypes from "prop-types";
import Legend from "./Legend";

// Marker icon fix for react-leaflet (source: https://bit.ly/39AdJb9)
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [13, 40], // Center customer marker icon (source: https://bit.ly/3AKGgXw)
});
L.Marker.prototype.options.icon = DefaultIcon;
// --------------------------------------------------

/**
 * We use the [OpenStreetMap]{@link https://www.openstreetmap.org/} API for tile layers.
 * We make a request to the API based on a center location. We disable scroll to zoom by
 * default, this just makes it simpler to explore the map, without unexpected zooming behaviour.
 *
 * @param {[Int, Int]} location - default location, the center of the map for the map API request.
 * @param {Int} zoom - The default zoom level for the map. Defaults to 13. This gives a reasonable
 * view of Wellington City, New Zealand. This can be changed to suit the user's location.
 * @returns Leaflet map with markers.
 */
const MarkerMap = ({ location, markers }) => (
  <MapContainer center={location} scrollWheelZoom={false} zoom={13}>
    <SetViewOnClick />
    <SetViewOnUpdate />
    <LayersControl position="topright">
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Legend colors={colors} types={types} />
      {types.map((t) => (
        <LayersControl.Overlay checked key={t} name={t}>
          <LayerGroup>
            {markers
              .filter(({ type }) => t === type)
              .map((marker, index) => (
                <MapMarker {...marker} key={t + index} />
              ))}
          </LayerGroup>
        </LayersControl.Overlay>
      ))}
    </LayersControl>
  </MapContainer>
);

MarkerMap.propTypes = {
  location: PropTypes.array.isRequired,
  markers: PropTypes.array.isRequired,
};

/**
 * This component allows the user to click on the map to set the center of the map.
 * @returns functional component that sets the map view to the center location.
 */
const SetViewOnClick = () => {
  // Update center when the user clicks a position on the map.
  const map = useMapEvent("click", (e) => {
    map.setView(e.latlng, map.getZoom(), { animate: true });
  });

  return null;
};

/**
 * Also, it listens to changes in the center of the map and updates the center context.
 * This can be useful as the center context stores the desired center of the map globally.
 * @returns functional component that updates map view when center context changes.
 */
const SetViewOnUpdate = () => {
  const { center } = useCenter();
  const map = useMap();

  // Update the center of the map when the center changes globally.
  useEffect(() => {
    setTimeout(() => {
      map.setView(center, map.getZoom(), { animate: true });
    }, 500);
  }, [center, map]);

  return null;
};

/**
 * There are three types of locations: school, work, interest.
 * These types are used to determine the colour of the marker.
 * This colour is the same for both the Map and Timeline components.
 */
const types = ["school", "work", "interest"];

/**
 * Constructs the customized leaflet marker for each location.
 *
 * @param {string} name - The name of the location.
 * @param {[Int, Int]} location - The GPS coordinates of the location (lat, long).
 * @param {string} image - The URI for the location brand logo.
 * @param {string} url - The URL to the homepage (if any) of the location.
 * @param {string} type - The type of location (i.e. school, work, interest).
 */
const MapMarker = ({ name, position, image, url, type }) => (
  <Marker key={name} position={position}>
    <Popup>
      <a href={url}>
        <img
          alt={name}
          src={image}
          style={{
            height: "50px",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </a>
      <br />
      {name}
      <br />
      <Link to={"/timeline"}> See more</Link>
    </Popup>
    <Circle
      center={position}
      pathOptions={{ color: colors[type], fillColor: colors[type] }}
      // Draws concentric rings for duplicate locations.
      radius={100}
      weight={5}
    />
  </Marker>
);

MapMarker.propTypes = {
  name: PropTypes.string.isRequired,
  position: PropTypes.array.isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

/**
 * Defines the colours for each location type.
 * These are consistent for Map and Timeline.
 */
const colors = {
  school: "#c2185b",
  work: "#1976d2",
  interest: "purple",
};

export default MarkerMap;
export { types, colors };

// /**
//  * Checks if location is a duplicate. For example, a user
//  * may got to school and work at the same location (e.g. University).
//  * Or, have two seperate jobs at the same location (e.g. promotion).
//  *
//  * @param {*} type (i.e. school, work, interest)
//  * @param {*} name of the location.
//  * @returns true if duplicate, false otherwise.
//  */
// const isDuplicate = (type, name) => {
//   return type === "work" && (name === "VUW - Tutor" || name === "VUW - Research Assistant" || name === "VUW - PhD in Artificial Intelligence");
// };
