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
        IEEE AGM | Real-World AI Applications | Talk by Jesse Wood
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
            href="https://ieeexplore.ieee.org/document/9415263"
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
        </li> 
        <li>
          <a
            href="https://link.springer.com/chapter/10.1007/978-3-031-22695-3_36"
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
        </li> 
        <li>
          <a
            href="https://arxiv.org/abs/2308.09238"
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
        </li> 
        <li>
          <a
            href="https://dl.acm.org/doi/10.1145/3583131.3590434"
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
      </ul>
      <ul>
        <li>
          <a
            href="https://prezi.com/view/Jq0JfwOh3y7RFwtiy5BX/"
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
      </ul>
      <h4>Institute for Electrical and Electronics Engineers (IEEE) Anual Group Meeting (AGM)</h4>
      <p>
        Dear NZ Central Section members, 
        
        our Section's annual AGM meeting for 2023 is to be held at the Wellesley Boutique Hotel on Monday 27th November, 2023. 
        
        This event will consist of the AGM meeting followed by two talks, ending with a buffet dinner for members and partners. 
        
        Details are given below:
        <ul> 
          <li>Venue: Wellesley Boutique Hotel, 2-8 Maginnity Street, Wellington 6011</li>
          <li>Date: Monday 27th November, 2023</li>
          <li>Time: 6pm according to the following plan</li>
            <ol>
              <li>Start - 6:00 pm</li>
              <li>AGM - 7:00pm-7:30pm (approx)</li>
              <li>Dinner (buffet) - 9:00pm</li>
            </ol>
        </ul>
        All NZ Central Section members can and are encouraged to attend the AGM. The AGM is free to attend!

        The dinner, however, is not included. There will be a $20 NZD charge for dinner.
          
        Register
        {" "}
        <a href="https://enotice.mmsend.com/link.cfm?r=UZ4-u-2z1fJf9rV1-liHqg~~&pe=kDr5YEbCQPM1u1BV9ec1nwNviD2tR6xuLkBc0X3hDgJwUlgxcaoLmY3gnWFNtM6HnwQ3gNamMA8BA7bDJTps2A~~&t=vxGV5HpB2qnjuObBqe0Xng~~" target="_blank" rel="noreferrer">
          Link
        </a>
        {" "}
        for more information.
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
            <> {"}"} </>
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
        Coastal and Freshwater Group, Cawthron Institute, Nelson, New Zealand
          <p>
            {" "}
            <a
              href="mailto:ross.venell@cawthron.org.nz"
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

export default IEEE_AGM;
