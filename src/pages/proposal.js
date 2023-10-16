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

const AJCAI = () => {
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
        Rapid determination of bulk composition and quality of marine biomass in mass spectrometry
      </h1>
      <p style={{ color: "black" }}>
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
      </p>
      <p style={{ color: "grey" }}>
        supervisors:
        , Bach Nguyen (primary) <sup>1</sup>
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
          Navigating the analysis of mass spectrometry data for marine biomass and fish demands a technologically adept approach to derive accurate and actionable insights. This research will introduce a novel AI methodology to interpret a substantial repository of mass spectrometry datasets, utilizing pre-training strategies like Next Spectra Prediction and Masked Spectra Modeling, targeting enhanced interpretability and correlation of spectral patterns with chemical attributes. Three core research objectives are explored: 
          <ol>
            <li>precise fish species and body part identification via binary and multi-class classification, respectively;</li>
            <li>quantitative contaminant analysis employing multi-label classification and multi-output regression; and </li>
            <li>traceability through pair-wise comparison and instance recognition. By validating against traditional baselines and various downstream tasks, this work aims to enhance chemical analytical processes and offer fresh insights into the chemical and traceability aspects of marine biology and fisheries through advanced AI applications.</li>
          </ol>
          </p>
        </>
      )}
      <ul>
        <li>
          <a
            href="https://github.com/woodRock/fishy-business/blob/main/proposal/proposal.pdf"
            target="_blank"
            rel="noreferrer"
          >
            View Full Proposal
            <img
              src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png"
              width="15rem"
              alt="pdf icon"
            />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/woodRock/fishy-business/blob/main/proposal/slides.pdf"
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
            href="https://github.com/woodRock/fishy-business/"
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
      <h4>Doctoral Proposal Seminar</h4>
      <p>

      In order to progress from provisional registration, you must write a full research proposal. The proposal provides evidence that your proposed research is viable and that you have the capacity to carry it out successfully. To progress to full registration, you must:

      <ol>
        <li>write a full research proposal (length is dependent on school/programme requirements)</li>
        <li>present the proposal orally</li>
        <li>meet any other requirements set by your school or programme, including any required coursework.</li>
      </ol>

        Many schools will require you to present your proposal orally. In such cases, your School will normally advertise the presentation, and open it to all staff and postgraduate students who may be interested. 
        
        Visit
        {" "}
        <a href="https://www.wgtn.ac.nz/fgr/current-phd/provisional-to-full-registration/the-proposal" target="_blank" rel="noreferrer">
          provisional to full registration - the proposal
        </a>
        {" "}
        for more information.
      </p>
      <p>
        The proposal/slides here are for faster dissemination and academic research
        convinence purpose only, and the copyright of the final thesis belongs to
        the corresponding publishers!
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

export default AJCAI;
