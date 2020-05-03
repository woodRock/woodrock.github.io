import React from 'react';
import './index.css';
import Macs from './Macs';
import Niwa from './Niwa';
import Johns from './StJohns';

const JobsPage = () => (
  <div>
    <h1>Jobs</h1>
    <div class="timeline">
      <div class="timeline-container left">
        <div class="timeline-content twitter-style-border">
          <Niwa></Niwa>
          <img src="https://media.glassdoor.com/sqll/446203/niwa-squarelogo-1537142405945.png" alt="niwa logo"/>
        </div>
      </div>
      <div class="timeline-container right">
        <div class="timeline-content twitter-style-border">
          <Johns></Johns>
          <img src="https://trademe.tmcdn.co.nz/photoserver/full/1068533573.jpg" alt="nz venue co logo"/>
        </div>
      </div>
      <div className="timeline-container left">
        <div className="timeline-content twitter-style-border">
          <Macs></Macs>
          <img src="https://www.macsbrewbars.co.nz/images/logo-macs.png" alt="macs Brewery logo"/>
        </div>
      </div>
    </div>
  </div>
);

export default JobsPage;
