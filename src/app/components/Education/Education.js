import React from 'react';
import IBS from './IBS';
import SWIS from './SWIS';
import RC from './RC';
import VUW from './VUW';

const Education = () => (
  <div>
    <h1>Education</h1>
    <div class="timeline">
      <div class="timeline-container left">
        <div class="timeline-content twitter-style-border">
          <VUW></VUW>
        </div>
      </div>
      <div class="timeline-container right">
        <div class="timeline-content twitter-style-border">
          <RC></RC>
        </div>
      </div>
      <div className="timeline-container left">
        <div className="timeline-content twitter-style-border">
          <SWIS></SWIS>
        </div>
      </div>
      <div className="timeline-container right">
        <div className="timeline-content twitter-style-border">
          <IBS></IBS>
        </div>
      </div>
    </div>
  </div>
);

export default Education;
