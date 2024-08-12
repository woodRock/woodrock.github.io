/**
 * Map page - Map.js
 * =================
 *
 * This shows a Map with markers for my education and work experience.
 * For now, it gives a map of Wellington, New Zealand.
 */

import React from "react";
import MarkerMap from "../components/MarkerMap";
import { useParams } from "react-router-dom";

const DEFAULT_CENTER = [-41.2865, 174.7762];

const Map = () => {
  const { id } = useParams();
  let center;
  // If the id exists, the user is being redirected from the timeline.
  if (id !== null && id !== undefined) {
    const selected = markers.filter((marker) => marker.name === id)[0].position;
    center = selected !== null ? selected : DEFAULT_CENTER;
  } else {
    // Otherwise, the user has just entered the home page.
    center = DEFAULT_CENTER;
  }
  return <MarkerMap location={center} markers={markers} />;
};

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
    name: "AJCAI 2024 - Published second paper!",
    position: [37.8136, 144.9631],
    image: "https://ajcai2024.org/imgs/logo.png",
    url: "http://woodrock.github.io/#/AJCAI_2024",
    type: "school",
    date: "November 2024",
  },
  {
    name: "IEEE Symposium 2024",
    position: [-41.28993225097656, 174.77],
    image: "https://s3.amazonaws.com/libapps/accounts/1104/images/ieee.jpg",
    url: "http://woodrock.github.io/#/IEEE_Symposium_2024",
    type: "school",
    date: "August 2024",
  },
  {
    name: "Seafood New Zealand Conference 2024",
    position: [-36.85286161216932, 174.76057286582883],
    image: "https://www.seafood.co.nz/fileadmin/templates/img/SFNZ_Logo_Inverted_NEW.svg",
    url: "https://www.seafood.co.nz/news-and-events/conference",
    type: "school",
    date: "August 2024",
  },
  {
    name: "IEEE AGM | Real-World AI Applications | Talk by Jesse Wood",
    position: [-41.28138, 174.77727],
    image: "https://s3.amazonaws.com/libapps/accounts/1104/images/ieee.jpg",
    url: "http://woodrock.github.io/#/IEEE_AGM",
    type: "school",
    date: "November 2023",
  },
  {
    name: "Doctoral proposal seminar",
    position: [-41.28993225097656, 174.77],
    image: "https://pbs.twimg.com/media/F7zrox5aAAAXA6c?format=jpg&name=medium",
    url: "http://woodrock.github.io/#/proposal",
    type: "school",
    date: "October 2023",
  },
  {
    name: "Linda Lee Wood (Thompson) - Funeral Service",
    position: [-41.340463, 174.77152],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiujvYUKe8ab_lgpsKdwp85Rqw2YOiqdwK2A&usqp=CAU",
    url: "http://woodrock.github.io/#/LindaLeeWood",
    type: "interest",
    date: "March 16th, 2023",
  },
  {
    name: "AJCAI 2022 - Published first paper!",
    position: [-31.960772129781056, 115.87370512655177],
    image: "https://ajcai2022.org/wp-content/uploads/2022/05/ColouredLogo.png",
    url: "http://woodrock.github.io/#/AJCAI_2022",
    type: "school",
    date: "December 2022",
  },
  {
    name: "GECCO 2022 - Attended virtually",
    position: [42.3601, 71.0589],
    image: "https://gecco-2022.sigevo.org/dl742",
    url: "https://gecco-2022.sigevo.org/HomePage",
    type: "school",
    date: "July 2022",
  },
  {
    name: "EvoStar 2022 - Attended virtually",
    position: [40.416775, -3.703790],
    image: "https://www.evostar.org/2022/wp-content/themes/sparkling/img/logo/logo_2.png",
    url: "https://www.evostar.org/2022/",
    type: "school",
    date: "April 2022",
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
    name: "Niwa - Software Developer (contract)",
    position: [-41.3019314, 174.8055404],
    image:
      "https://media.glassdoor.com/sqll/446203/niwa-squarelogo-1537142405945.png",
    url: "https://www.niwa.co.nz/",
    type: "work",
    date: "2020 - 2024",
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
export { markers, DEFAULT_CENTER };
