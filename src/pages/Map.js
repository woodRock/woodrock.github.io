/**
 * Map page - Map.js
 * =================
 *
 * This shows a Map with markers for my education and work experience.
 * For now, it gives a map of Wellington, New Zealand.
 */

import React from "react";
import MarkerMap from "../components/MarkerMap";

const Map = () => {
  return <MarkerMap location={DEFAULT_CENTER} markers={markers} />;
};

// GPS coordinates of Wellington.
const DEFAULT_CENTER = [-41.31, 174.79];

/**
 * These markers are used to show the places that are displayed on the map.
 * They are also used in the Timeline component, so the order matters, they
 * must be from newest to oldest, such that the newest marker is on top.
 *
 * The markers are in the format:
 *
 * @param {String} name - The name of the role.
 * @param {[Int, Int]} position - The GPS coordinates of the place (lat, long)
 * @param {String} image - A URI of the workplace logo.
 * @param {String} url - A URL to their homepage.
 * @param {String} type - The type of marker, either "work", "education" or "interest".
 * @param {String} date - The time period when the role was held (i.e. 2005 - 2007).
 */
const markers = [
  {
    name: "AJCAI 2022 - Published first paper!",
    position: [-31.960772129781056, 115.87370512655177],
    image: "https://ajcai2022.org/wp-content/uploads/2022/05/ColouredLogo.png",
    url: "http://woodrock.github.io/#/AJCAI",
    type: "school",
    date: "December 2022",
  },
  {
    name: "VUW - PhD in Artificial Intelligence",
    position: [-41.28993225097656, 174.7685546875],
    image: "https://www.wgtn.ac.nz/__data/assets/image/0011/1754678/Shield.png",
    url: "https://ecs.wgtn.ac.nz/Main/GradJesseWood",
    type: "school",
    date: "2022 - Present",
  },
  {
    name: "VUW - Research Assistant",
    position: [-41.28993225097656, 174.7685546875],
    image: "https://www.wgtn.ac.nz/__data/assets/image/0011/1754678/Shield.png",
    url: "https://www.wgtn.ac.nz/",
    type: "work",
    date: "2021 - 2022",
  },
  {
    name: "VUW - Tutor",
    position: [-41.28993225097656, 174.7685546875],
    image: "https://www.wgtn.ac.nz/__data/assets/image/0011/1754678/Shield.png",
    url: "https://www.wgtn.ac.nz/",
    type: "work",
    date: "2021 - Present",
  },
  {
    name: "VUW - Tutor",
    position: [-41.28993225097656, 174.7685546875],
    image: "https://www.wgtn.ac.nz/__data/assets/image/0011/1754678/Shield.png",
    url: "https://www.wgtn.ac.nz/",
    type: "work",
    date: "2021 - Present",
  },
  {
    name: "Niwa - Software Developer (contract)",
    position: [-41.3019314, 174.8055404],
    image:
      "https://media.glassdoor.com/sqll/446203/niwa-squarelogo-1537142405945.png",
    url: "https://www.niwa.co.nz/",
    type: "work",
    date: "2020 - Present",
  },
  {
    name: "VUW - BE (Hons) Software Engineering",
    position: [-41.28993225097656, 174.7685546875],
    image: "https://www.wgtn.ac.nz/__data/assets/image/0011/1754678/Shield.png",
    url: "https://www.wgtn.ac.nz/",
    type: "school",
    date: "2016 - 2021",
  },
  {
    name: "Rongotai College",
    position: [-41.322705, 174.8004653],
    image:
      "https://pbs.twimg.com/profile_images/653471147674107904/yrngGUVT_400x400.jpg",
    url: "https://www.rongotai.school.nz/",
    type: "school",
    date: "2011 - 2015",
  },
  {
    name: "SWIS Intermediate",
    position: [-41.3183829, 174.7789825],
    image: "https://i.imgur.com/Qlf29ue.jpeg",
    url: "http://www.swis.school.nz/",
    type: "school",
    date: "2010 - 2012",
  },
  {
    name: "Island Bay",
    position: [-41.3357583, 174.7754525],
    image:
      "https://pbs.twimg.com/profile_images/3241466964/c617b804550de86eae67350babc41f07_400x400.jpeg",
    url: "https://www.islandbay.school.nz/",
    type: "school",
    date: "2004 - 2009",
  },
];

export default Map;
export { markers };
