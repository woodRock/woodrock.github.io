import React from "react";
import { Circle, LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom"; 
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
    iconAnchor: [13, 40] // Center customer marker icon (source: https://bit.ly/3AKGgXw)
});
L.Marker.prototype.options.icon = DefaultIcon;
// --------------------------------------------------

/**
 * Display a map with a set of markers at a given location.
 * 
 * @param {NewType, markers} param0 - default location, and markers for map.
 * @returns Leaflet map with markers.
 */
const MarkerMap = ({ location, markers }) => (
  <MapContainer center={ location } scrollWheelZoom={ false } zoom={ 13 }>
    <LayersControl position="topright">
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Legend colors={ colors } types={ types } />
      {types.map( t => (
        <LayersControl.Overlay checked key={ t } name={ t }>
          <LayerGroup>
            {  
                        markers.filter(({ type }) => t === type)
                        .map((marker,index) => (
                          <MapMarker { ...marker } key={ t+index } />
                        ))
                        }
          </LayerGroup>
        </LayersControl.Overlay>
                ))}
    </LayersControl>
  </MapContainer>
);

MarkerMap.propTypes = {
  location: PropTypes.array.isRequired,
  markers: PropTypes.array.isRequired
};

// Types of markers.
const types = ["school", "work", "interest"];

/**
 * Constructs the customized marker for each location.
 * @param {name, position, image, type} param0 
 */
const MapMarker = ({ name, position, image, url, type }) => (
  <Marker key={ name } position={ position }>
    <Popup>
      <a href={ url }>
        <img
          alt={ name }
          src={ image }
          style={ {
                    height: "50px",
                    justifyContent: "center",
                    alignItems: "center",
              } }
        />
      </a>
      <br />
      {name}
      <br />
      <Link to={ "/timeline" }> See more</Link>
    </Popup>
    <Circle
      center={ position }
      pathOptions={ { color: colors[type], fillColor: colors[type] } }
      // Draws concentric rings for duplicate locations.
      radius={ isDuplicate(type, name)? 170 : 100 }
      weight={ 5 }
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

// Color dictionary for markers.
const colors = {
  school: "#c2185b",
  work: "#1976d2",
  interest: "purple"
};

/**
 * Checks if location is a duplicate. 
 * @param {*} type (i.e. school, work, interest)
 * @param {*} name of the location.
 * @returns true if duplicate, false otherwise.
 */
const isDuplicate = (type, name) => {
  return type === "work" && (name === "VUW - Tutor" || name === "VUW - Research Assistant");
};

export default MarkerMap;
export {types, colors};
