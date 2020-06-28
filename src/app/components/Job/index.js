import React from 'react';
import './index.css';
import Macs from './Macs';
import Niwa from './Niwa';
import Johns from './StJohns';

const JobsPage = () => (<div>
  <h1>Jobs</h1>
  <div class="timeline">
    <div class="timeline-container left">
      <div class="timeline-content twitter-style-border">
        <Niwa></Niwa>
      </div>
    </div>
    <div class="timeline-container right">
      <div class="timeline-content twitter-style-border">
        <Johns></Johns>
      </div>
    </div>
    <div className="timeline-container left">
      <div className="timeline-content twitter-style-border">
        <Macs></Macs>
      </div>
    </div>
  </div>
</div>);

export default JobsPage;
