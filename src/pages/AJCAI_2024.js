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
import useIsMobile from "../api/IsMobile.js";

const AJCAI_2024 = () => {
  const isMobile = useIsMobile();

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
      <h1>
        A rapid machine-learning approach for detecting fish species and body parts 
        using rapid evaporative ionisation mass spectrometry
      </h1>
      <p style={{ color: "grey" }}>
        Jesse Wood<sup>1</sup>
        <a
          href="https://orcid.org/0000-0003-3756-2122"
          target="_blank"
          rel="noreferrer"
        >
          <img
            alt="ORCID logo"
            src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
            width="16"
            height="16"
          />
        </a>
        , Bach Nguyen<sup>1</sup>
        <a
          href="https://orcid.org/0000-0002-6930-6863"
          target="_blank"
          rel="noreferrer"
        >
          <img
            alt="ORCID logo"
            src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
            width="16"
            height="16"
          />
        </a>
        , Bing Xue<sup>1</sup>
        <a
          href="https://orcid.org/0000-0002-4865-8026"
          target="_blank"
          rel="noreferrer"
        >
          <img
            alt="ORCID logo"
            src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
            width="16"
            height="16"
          />
        </a>
        , Mengjie Zhang<sup>1</sup>
        <a
          href="https://orcid.org/0000-0003-4463-9538"
          target="_blank"
          rel="noreferrer"
        >
          <img
            alt="ORCID logo"
            src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
            width="16"
            height="16"
          />
        </a>
        , Daniel Killeen<sup>2</sup>
        <a
          href="https://orcid.org/0000-0002-4898-6724"
          target="_blank"
          rel="noreferrer"
        >
          <img
            alt="ORCID logo"
            src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
            width="16"
            height="16"
          />
        </a>
      </p>
      {/* Only show the abstract if the user is viewing the website on a mobile device. */}
      {/* TODO: Turn into a function, that passes to html elements, and chooses based on isMobile. */}
      {/* TODO: Abstract as collapsable box - see https://codeconvey.com/html-expand-collapse-text-without-javascript/ */}
      {isMobile ? (
        <></>
      ) : (
        <>
          <h4>Abstract</h4>
          <p>
          Marine biomass compositional analysis is traditionally time-consuming and requires domain expertise. 
          Rapid evaporative ionisation mass spectrometry (REIMS) with automated machine learning may be able to 
          accelerate this process without compromising quality. 
          This study demonstrates REIMS’s effectiveness in rapid marine biomass composition determination, using 
          fish species and body parts as model systems that represent diverse biochemical profiles. 
          Using decision trees, genetic programming and novel unsupervised pre-training strategies for transformers, 
          the research achieved 99.58% accuracy in fish speciation and 63.33% accuracy for fish body parts classification, 
          two model systems that capture marine biomass with different compositions. 
          REIMS analysis with machine learning proves to be a fast, accurate, and interpretable technique for 
          real-time marine biomass compositional analysis, with potential applications in marine-based industry 
          quality control and product optimization.
          </p>
        </>
      )}
      <ul>
        <li>
          <a
            href="https://github.com/woodRock/fishy-business/blob/main/papers/AJCAI%202024/AJCAI/paper.pdf"
            target="_blank"
            rel="noreferrer"
          >
            View Full Paper
            <img
              src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png"
              width="15rem"
              alt="pdf icon"
            />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/woodRock/fishy-business/blob/main/papers/AJCAI%202024/AJCAI%20Presentation/slides.pdf"
            target="_blank"
            rel="noreferrer"
          >
            View Presentation
            <img
              src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png"
              width="15rem"
              alt="pdf icon"
            />
          </a>
        </li>
        {/* <li>
          <a
            href="https://github.com/woodRock/fishy-business/blob/main/papers/AJCAI_Poster/poster3476.pdf"
            target="_blank"
            rel="noreferrer"
          >
            View Poster
            <img
              src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png"
              width="15rem"
              alt="pdf icon"
            />
          </a>
        </li> */}
        <li>
          <a
            href="https://github.com/woodRock/fishy-business/tree/main/code"
            target="_blank"
            rel="noreferrer"
          >
            View Source Code
            <img
              src="https://logos-download.com/wp-content/uploads/2016/09/GitHub_logo.png"
              width="15rem"
              alt="github icon"
            />
          </a>
        </li>
      </ul>
      <h4>AJCAI 2024</h4>
      <p>
        37th Australasian Joint Conference on Artificial Intelligence to be held
        in Melbourne, Southeastern Australia in November 2024. See{" "}
        <a href="https://ajcai2024.org/" target="_blank" rel="noreferrer">
          AJCAI 2024
        </a>{" "}
        for more information.
      </p>
      <p>
        The paper/poster here are for faster dissemination and academic research
        convinence purpose only, and the copyright of the final paper belongs to
        the corresponding publishers!
      </p>
      <p>
        See{" "}
        <a
          href="https://github.com/woodRock/fishy-business/blob/main/papers/AJCAI%202024/AJCAI/paper.pdf"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>{" "}
        for the draft paper{" "}
      </p>
      <h4>Contact</h4>
      <ol>
        <li>
          Victoria University of Wellington, Te Herenga Waka, Wellington, New
          Zealand
          <p style={{ color: "grey" }}>
            <> {"{"} </>
            <a
              href="mailto:jesse.wood@ecs.vuw.ac.nz"
              target="_blank"
              rel="noreferrer"
            >
              jesse.wood
            </a>
            <> {", "} </>
            <a
              href="mailto:hoai.bach.nguyen@ecs.vuw.ac.nz"
              target="_blank"
              rel="noreferrer"
            >
              hoai.bach.nguyen
            </a>
            <> {", "} </>
            <a
              href="mailto:bing.xue@ecs.vuw.ac.nz"
              target="_blank"
              rel="noreferrer"
            >
              bing.xue
            </a>
            <> {", "} </>
            <a
              href="mailto:mengjie.zhang@ecs.vuw.ac.nz"
              target="_blank"
              rel="noreferrer"
            >
              mengjie.zhang
            </a>
            <> {"} @ecs.vuw.ac.nz"} </>
          </p>
        </li>
        <li>
          New Zealand Institute for Plant and Food Research Limited, Nelson, New
          Zealand
          <p>
            {" "}
            <a
              href="mailto:daniel.killeen@plantandfood.co.nz"
              target="_blank"
              rel="noreferrer"
            >
              daniel.killeen@plantandfood.co.nz
            </a>{" "}
          </p>
        </li>
      </ol>
      <HomeButton />
    </div>
  );
};

export default AJCAI_2024;
