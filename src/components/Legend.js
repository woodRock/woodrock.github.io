/**
 * Legend component - Legend.js
 * ============================
 * Legend for the map - shows each type and its corresponding color.
 * This is a custom legend that gives a colour key for the map based
 * on the type of the marker defined in the [Map]{@link Map} page.
 * (Source https://bit.ly/3o8MHQt)
 */

import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "./Legend.css";

/**
 * These two parameters should be lists of equal length.
 * We give a list of types, and their corresponding colours.
 *
 * @param {[String]} types - The types of markers to be displayed in the legend.
 * @param {[String]} colors - The colors of the markers to be displayed in the legend.
 * @returns
 */
const Legend = ({ types, colors }) => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      let labels = [];
      let type;
      for (let i = 0; i < types.length; i++) {
        type = types[i];
        labels.push('<i style="background:' + colors[type] + '"></i> ' + type);
      }
      div.innerHTML = labels.join("<br>");
      return div;
    };
    legend.addTo(map);
  }, [colors, map, types]);

  return null;
};

export default Legend;
