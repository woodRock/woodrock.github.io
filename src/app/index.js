import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ROUTES from './constants/routes';
import SocialPage from './components/Social';
import Navigation from './components/Navigation';
import CopyRight from './components/Copyright';
import { withAuthentication } from './util/Session';
import logo from '../assets/logo.png';

const App = () => (
  <Router>
    <div>
      <header>
        <div className="navigation">
          <Navigation />
        </div>
      </header>
      <div className="container">
        <div className="content">
          {ROUTES.map(r => (
            <Route path={r.path} component={r.component} />
          ))}
        </div>
      </div>
    </div>
  </Router>
);

export default withAuthentication(App);
