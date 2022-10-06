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
import {HomeButton} from "../components/Buttons.js";
import useIsMobile from "../api/IsMobile.js";

const AJCAI = () => {

    const isMobile = useIsMobile();

    return (
        <div style={{
            width: "80%",
            margin: "auto",
            padding: "20px",
            background: "white",
            textAlign: "left",
        }}>
            <h1>Automated Fish Classification Using Unprocessed Fatty Acid Chromatographic Data: A Machine Learning Approach</h1>
            <p style={{color:"grey"}}>
                Jesse Wood<sup>1</sup>
                <a href="https://orcid.org/0000-0003-3756-2122" target="_blank">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png" width="16" height="16" />
                </a>, 
                Bach Nguyen<sup>1</sup>
                <a href="https://orcid.org/0000-0002-6930-6863" target="_blank">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png" width="16" height="16" />
                </a>, 
                Bing Xue<sup>1</sup>
                <a href="https://orcid.org/0000-0002-4865-8026" target="_blank">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png" width="16" height="16" />
                </a>, 
                Mengjie Zhang<sup>1</sup>
                <a href="https://orcid.org/0000-0003-4463-9538" target="_blank">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png" width="16" height="16" />
                </a>, 
                Daniel Killeen<sup>2</sup>
                <a href="https://orcid.org/0000-0002-4898-6724" target="_blank">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png" width="16" height="16" />
                </a>
            </p>
            {/* Only show the abstract if the user is viewing the website on a mobile device. */}
            {/* TODO: Turn into a function, that passes to html elements, and chooses based on isMobile. */}
            {/* TODO: Abstract as collapsable box - see https://codeconvey.com/html-expand-collapse-text-without-javascript/ */}
            { isMobile?
                <></>
            :
                <>
                    <h4>Abstract</h4>
                    <p>
                        Fish is approximately 40% edible fillet. 
                        The remaining 60% can be processed into low-value fertilizer or high-value pharmaceutical-grade omega-3 concentrates.
                        High-value manufacturing options depend on the composition of the biomass, which varies with fish species, fish tissue and seasonally throughout the year.
                        Fatty acid composition, measured by Gas Chromatography, is an important measure of marine biomass quality.
                        This technique is accurate and precise, but processing and interpreting the results is time-consuming and requires domain-specific expertise.
                        The paper investigates different classification and feature selection algorithms for their ability to automate the processing of Gas Chromatography data.
                        Experiments found that SVM could classify compositionally diverse marine biomass based on raw chromatographic fatty acid data. 
                        The SVM model is interpretable through visualization which can highlight important features for classification.
                        Experiments demonstrated that applying feature selection significantly reduced dimensionality and improved classification performance on high-dimensional low sample-size datasets.
                        According to the reduction rate, feature selection could accelerate the classification system up to four times.
                    </p>
                </>
            }
            <ul>
                <li>
                    <a href="https://github.com/woodRock/fishy-business/blob/main/papers/AJCAI/paper3476.pdf" target="_blank">
                        View Full Paper
                        <img src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png" width="15rem" />
                    </a>
                </li>
                <li>
                    <a href="https://github.com/woodRock/fishy-business/blob/main/papers/AJCAI_Poster/poster3476.pdf" target="_blank">
                        View Poster
                        <img src="https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png" width="15rem" />
                    </a>
                </li>
                <li>
                    <a href="https://github.com/woodRock/fishy-business/tree/main/code/pso" target="_blank">
                        View Source Code 
                        <img src="https://logos-download.com/wp-content/uploads/2016/09/GitHub_logo.png" width="15rem"/>
                    </a>
                </li>
            </ul>
            <h4>AJCAI 2022</h4>
            <p>
                35th Australasian Joint Conference on Artificial Intelligence to be held in Perth, Western Australia in December 2022. 
                See <a href="https://ajcai2022.org/" target="_blank">AJCAI 2022</a> for more information.
            </p>
            <p>
                The paper/poster here are for faster dissemination and academic research convinence purpose only, and the copyright of the final paper belongs to the corresponding publishers ! 
            </p>
            <h4>Contact</h4>
            <ol>
                <li> 
                    Victoria University of Wellington, Te Herenga Waka,  Wellington, New Zealand 
                    <p style={{color: "grey"}}> 
                        <> { "{"  } </>
                        <a href="mailto:jesse.wood@ecs.vuw.ac.nz" target="_blank">jesse.wood</a>
                        <> { ", "  } </>
                        <a href="mailto:hoai.bach.nguyen@ecs.vuw.ac.nz" target="_blank">hoai.bach.nguyen</a>
                        <> { ", "  } </>
                        <a href="mailto:bing.xue@ecs.vuw.ac.nz" target="_blank">bing.xue</a>
                        <> { ", "  } </>
                        <a href="mailto:mengjie.zhang@ecs.vuw.ac.nz" target="_blank">mengjie.zhang</a>
                        <> { "} @ecs.vuw.ac.nz" } </> 
                    </p>
                </li>
                <li> 
                    New Zealand Institute for Plant and Food Research Limited, Nelson, New Zealand 
                    <p> <a href="mailto:daniel.killeen@plantandfood.co.nz" target="_blank">daniel.killeen@plantandfood.co.nz</a> </p>
                </li>
            </ol>
            < HomeButton />
        </div>
    )
};

export default AJCAI;