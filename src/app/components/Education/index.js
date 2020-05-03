import React from 'react';
import IBS from './IBS';
import SWIS from './SWIS';
import RC from './RC';
import VUW from './VUW';

const Education = () => (
  <div>
    <h1>Jobs</h1>
    <div class="timeline">
      <div class="timeline-container left">
        <div class="timeline-content twitter-style-border">
          <VUW></VUW>
          <img src="https://pbs.twimg.com/profile_images/1199432744800931840/s3kZhXK2_400x400.png" alt="Victoria University Logo"/>
        </div>
      </div>
      <div class="timeline-container right">
        <div class="timeline-content twitter-style-border">
          <RC></RC>
          <img src="https://pbs.twimg.com/profile_images/653471147674107904/yrngGUVT_400x400.jpg" alt="Rongotai College logo"/>
        </div>
      </div>
      <div className="timeline-container left">
        <div className="timeline-content twitter-style-border">
          <SWIS></SWIS>
          <img src="http://www.swis.school.nz/wp-content/uploads/2019/04/SWIS-LogoOnWhite-291x100.jpg" alt="SWIS School logo"/>
        </div>
      </div>
      <div className="timeline-container right">
        <div className="timeline-content twitter-style-border">
          <IBS></IBS>
          <img src="https://pbs.twimg.com/profile_images/3241466964/c617b804550de86eae67350babc41f07_400x400.jpeg" alt="Island Bay School logo"/>
        </div>
      </div>
    </div>
  </div>
);

export default Education;
