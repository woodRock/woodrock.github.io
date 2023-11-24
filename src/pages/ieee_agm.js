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

const IEEE_AGM = () => {
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
        IEEE AGM - Read More from the Papers Presented by Jesse Wood
      </h1>
      <p style={{ color: "black" }}>
        Mohamad Rimas<sup>1</sup>
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
        , Jesse Wood<sup>1</sup>
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
        , Carl McMillan<sup>1</sup>
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
        , Jordan MacLaughlan<sup>1</sup>
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
          IEEE AGM - Presentation on Real-World AI Applications. Read More from the Papers Presented 
          <ol>
            <li>Rimas - Machine Learning-Based Service Differentiation in the 5G Core Network</li>
            <li>Jesse - Automated Fish Classification Using Unprocessed Fatty Acic Chromatographic Data: A Machine Learning Approach </li>
            <li>Carl - Improving Buoy Detection with Deep Tranfer Learning for Mussel Farm Buoyancy </li>
            <li>Jordan - Learning Emergency Medical Dispatch Policies Via Genetic Programming</li>
          </ol>
          Advanced applications of Artificial Intelligence (AI) in the real-world are becoming more common. Those real-world applications, include, but are not limited to, 5G cellular splicing, automated fish classification, automated mussel float byoancy detection, and last but not least, emergency medical dispatch policies.
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
            Rimas 
            <img
              src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png"
              width="15rem"
              alt="pdf icon"
            />
          </a>
          <a
            href="https://github.com/woodRock/fishy-business/blob/main/proposal/proposal.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Jesse 
            <img
              src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png"
              width="15rem"
              alt="pdf icon"
            />
          </a>
          <a
            href="https://github.com/woodRock/fishy-business/blob/main/proposal/proposal.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Carl 
            <img
              src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png"
              width="15rem"
              alt="pdf icon"
            />
          </a>
          <a
            href="https://github.com/woodRock/fishy-business/blob/main/proposal/proposal.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Jordan 
            <img
              src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png"
              width="15rem"
              alt="pdf icon"
            />
          </a>
        </li>
        <li>
          <a
            href="https://prezi.com/view/IJ7eURbj5FVEErzaoboU/"
            target="_blank"
            rel="noreferrer"
          >
            View Presentation (fancy)
            <img
              src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png"
              width="15rem"
              alt="pdf icon"
            />
          </a>
        </li>
        
      <h4>Institute for Electrical and Electronics Engineers (IEEE) Anual Group Meeting (AGM)</h4>
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
              href="mailto:rimas.mohamad@ecs.vuw.ac.nz"
              target="_blank"
              rel="noreferrer"
            >
              rimas.mohamad
            </a>
            <> {", "} </>
            <a
              href="mailto:jesse.wood@ecs.vuw.ac.nz"
              target="_blank"
              rel="noreferrer"
            >
              jesse.wood
            </a>
            <> {", "} </>
            <a
              href="mailto:carl.mcmillan@ecs.vuw.ac.nz"
              target="_blank"
              rel="noreferrer"
            >
              carl.mcmillan
            </a>
            <> {", "} </>
            <a
              href="mailto:jordan.maclaughlan@ecs.vuw.ac.nz"
              target="_blank"
              rel="noreferrer"
            >
              jordan.maclaughlan
            </a>
          </p>
        </li>
        <li>
        Dept. Electrical Engineering University of Cape Town Cape Town, South Africa
          <p>
            {" "}
            <a
              href="mailto:daniel.killeen@plantandfood.co.nz"
              target="_blank"
              rel="noreferrer"
            >
              Joyce Mwangama
            </a>{" "}
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
              Daniel killeen
            </a>{" "}
          </p>
        </li>
        <li>
          Wellington Free Ambulance, Wellington, New Zealand
          <p>
            {" "}
            <a
              href="ross.venell@cawthron.org.nz"
              target="_blank"
              rel="noreferrer"
            >
              Ross Vennell
            </a>{" "}
          </p>
        </li>
        {/* <li>
          Wellington Free Ambulance, Wellington, New Zealand
          <p>
            {" "}
            <a
              href="mailto:jessica.signal@wfa.org.nz"
              target="_blank"
              rel="noreferrer"
            >
              Jessica Signal
            </a>{" "}
          </p>
        </li> */}
      </ol>
      <HomeButton />
    </div>
  );
};

export default AJCAI;
