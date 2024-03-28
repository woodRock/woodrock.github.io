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

const AIRA = () => {
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
            If outliers exist contaminated else not contaminated
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
          Occam's razor prescribes the simplest solution that works is the best. 
    This relates to the machine learning phenomena of overfitting. 
    Where complex models overfit and learn noise in the training set, 
    then fail to generalize to the test set.
    However, in this peculiar case, Occam's razor eliminates machine learning altogether.
    Leading to a zero-shot algorithm for contamination detection in marine biomass, 
    that doesn't require any training whatsoever.
    Outlier thresholding via Grubbs' test, combined with a conditional if statement,
    gives a robust solution for detecting mineral oil contamination in marine biomass, in less than 25 lines of Python code. 
    This work presents a contamination detection algorithm for detecting mineral oil contaminants in marine biomass with rapid evaporative ionisation mass spectrometry.
          </p>
        </>
      )}
      <ul>
        <li>
          <a
            href="https://github.com/woodRock/fishy-business/blob/main/papers/AJCAI/paper3476.pdf"
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
            href="https://github.com/woodRock/fishy-business/blob/main/papers/AJCAI_Presentation/presentation3476.pdf"
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
        <li>
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
        </li>
        <li>
          <a
            href="https://github.com/woodRock/fishy-business/blob/main/code/contamination/detection/R02_S01_Contamination_Detection.ipynb"
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
      <h4>AIRA 2024</h4>
      <p>
        AI Research Assosication 2024 conference to be held
        in Auckland New Zealand in April 2024. See{" "}
        <a href="https://www.ainz.ai/" target="_blank" rel="noreferrer">
          AIRA 2024
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
          href="https://link.springer.com/chapter/10.1007/978-3-031-22695-3_36"
          target="_blank"
          rel="noreferrer"
        >
          Springer Nature
        </a>{" "}
        for the final paper (this requires a subscription!){" "}
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

export default AIRA;
