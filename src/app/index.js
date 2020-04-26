import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ROUTES from './constants/routes';
import SocialPage from './components/Social';
import Navigation from './components/Navigation';
import CopyRight from './components/Copyright';
import { withAuthentication } from './util/Session';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <hr />
      {ROUTES.map(r => (
        <Route path={r.path} component={r.component} />
      ))}
      <hr/>
      <SocialPage/>
      <p>
        <i>This site was made using React + Firebase</i>
      </p>
      <CopyRight/>
    </div>
  </Router>
);

export default withAuthentication(App);
