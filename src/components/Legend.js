import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "./Legend.css";

/**
 * Legend for the map - shows each type and its corresponding color.
 * Source https://bit.ly/3o8MHQt)
 * @param {types, colours} param0 names of types, matching colours.
 * @returns 
 */
const Legend = ({types, colors}) => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      let labels = [];
      let type;

      for (let i = 0; i < types.length; i++) {
        type = types[i];
        labels.push(
            "<i style=\"background:" +
            colors[type] +
            "\"></i> " + type
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };
    legend.addTo(map);
  },[]);
  
  return null;
};

export default Legend;
