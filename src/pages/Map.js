import React from "react";
import MarkerMap from "../components/MarkerMap";

/**
 * A Map of Wellington with markers for locations of interest.
 * For example: current workplace, schools, university. 
 */
const Map = () => (
  <MarkerMap location={ location } markers={ markers } />
);

// GPS coordinates of Wellington.
const location = [-41.31, 174.79]; 

// Marker metadata for locations of interest with a Popup.
const markers = [
    { 
        name: "Victoria University of Wellington", 
        position: [-41.28993225097656,174.7685546875],
        image: "https://i1.sndcdn.com/avatars-000751225282-2lnuu5-original.jpg",
        url: "https://www.wgtn.ac.nz/",
        type: "work",
        date: "2021 - present"
    },
    { 
        name: "Wellington Chamber Of Commerce", 
        position: [-41.28666552, 174.772996908],
        image: "https://www.wecc.org.nz/__data/assets/image/0009/3312/bg-chamber-header.png",
        url: "https://www.wecc.org.nz/",
        type: "work",
        date: "2021 - present"
    },
    { 
        name: "Niwa", 
        position: [-41.3019314,174.8055404],
        image: "https://media.glassdoor.com/sqll/446203/niwa-squarelogo-1537142405945.png",
        url: "https://www.niwa.co.nz/",
        type: "work",
        date: "2020 - present"
    },
    { 
        name: "Victoria University of Wellington", 
        position: [-41.28993225097656,174.7685546875],
        image: "https://i1.sndcdn.com/avatars-000751225282-2lnuu5-original.jpg",
        url: "https://www.wgtn.ac.nz/",
        type: "school",
        date: "2016 - present"
    },
    { 
        name: "Rongotai College", 
        position: [-41.322705,174.8004653],
        image: "https://pbs.twimg.com/profile_images/653471147674107904/yrngGUVT_400x400.jpg",
        url: "https://www.rongotai.school.nz/",
        type: "school",
        date: "2011 - 2015"
    },
    { 
        name: "SWIS Intermediate School", 
        position: [-41.3183829,174.7789825],
        image: "https://i.imgur.com/Qlf29ue.jpeg",
        url: "http://www.swis.school.nz/",
        type: "school",
        date: "2010 - 2012"
    },
    { 
        name: "Island Bay School", 
        position: [-41.3357583,174.7754525],
        image: "https://pbs.twimg.com/profile_images/3241466964/c617b804550de86eae67350babc41f07_400x400.jpeg",
        url: "https://www.islandbay.school.nz/",
        type: "school",
        date: "2004 - 2006"
    }
];

export default Map;
export {markers};
