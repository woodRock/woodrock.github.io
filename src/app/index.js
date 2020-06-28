import React from 'react';
import {HashRouter, Route} from "react-router-dom";
import ROUTES from './constants/routes';
import SocialPage from './components/Social';
import Navigation from './components/Navigation';
import CopyRight from './components/Copyright';
import {withAuthentication} from './util/Session';
import './index.css';

const Header = () => (<div>
  <div className="navigation twitter-style-border">
    <Navigation/>
  </div>
</div>);

const Container = () => (<div className="container twitter-style-border">
  <div className="">
    {ROUTES.map(r => (<Route key={r.path} path={r.path} component={r.component}/>))}
  </div>
</div>);

const Footer = () => (<div>
  <SocialPage></SocialPage>
  <CopyRight></CopyRight>
</div>);

const App = () => (<HashRouter>
  <Header/>
  <Container/>
  <Footer/>
</HashRouter>);

export default withAuthentication(App);
