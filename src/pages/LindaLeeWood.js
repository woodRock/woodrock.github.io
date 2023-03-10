/**
 * AJCAI page - AJCAI.js
 * =====================
 *
 * This page gives the user a link to the paper, poster and code for the AJCAI paper.
 * This will be linked to the QR code in the poster, so that people can easily find it.
 * This uses the better poster idea for poster presentations at academic conferences.
 * (See Youtube Video here for more https://www.youtube.com/watch?v=1RwJbhkCA58)
 */

import React from "react";
import { HomeButton } from "../components/Buttons.js";
import Mum from "../assets/Mum.jpg";
import MapPin from "../assets/map_pin.png";

const AJCAI = () => {
  return (
    <div
      style={{
        width: "80%",
        margin: "auto",
        padding: "20px",
        background: "white",
        textAlign: "left",
      }}
    >
      <h1>Linda Lee Wood</h1>
      <img src={Mum} style={{ width: "20rem" }}></img>
      <h3>Death Notice</h3>
      <h5>Wood, Linda Lee (Thompson)</h5>
      <p>
        Passed away suddenly on the 7 th March 2023, aged 58, in Wellington.
        Cherished mother of Jesse Wood. Avid sports junkie/journalist. A funeral
        service will be held at 1pm, Thursday 16 th March, St. Hilda’s Anglican
        Church, Island Bay. Followed by a private cremation.
      </p>
      <h4>Livestream</h4>
      <a
        href="https://vuw.zoom.us/j/9108206735"
        target="_blank"
        rel="noreferrer"
      >
        Click here to watch the funeral remotely.
        {"  "}
        <img
          src="https://e7.pngegg.com/pngimages/403/846/png-clipart-streaming-media-broadcasting-logo-computer-icons-netstat-television-logo.png"
          width="15rem"
          alt="pdf icon"
        />
      </a>
      <h4>Directions</h4>
      <a
        href="https://goo.gl/maps/G68biNdbTcAgUjHV8"
        target="_blank"
        rel="noreferrer"
      >
        Click here for directions.
        {"  "}
        <img src={MapPin} width="15rem" alt="pdf icon" />
      </a>
      <h4>Contact</h4>
      Jesse Wood - Son
      <ul>
        <li>
          <p style={{ color: "grey" }}>
            Email:
            <>{"  "}</>
            <a
              href="mailto:j.r.h.wood98@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              j.r.h.wood98@gmail.com
            </a>
          </p>
        </li>
        <li>
          <p style={{ color: "grey" }}>
            Phone:
            <>{"  "}</>
            <a href="tel:+642102648190" target="_blank" rel="noreferrer">
              +64 2102648190
            </a>
          </p>
        </li>
      </ul>
      <HomeButton />
    </div>
  );
};

export default AJCAI;
