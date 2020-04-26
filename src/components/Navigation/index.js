import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <div>
    <span>
      <Link to={ROUTES.HOME}><i className="material-icons">home</i></Link>
    </span>
    <span>
      <Link to={ROUTES.PROJECTS}><i className="material-icons">code</i></Link>
    </span>
    <span>
      <Link to={ROUTES.BLOG}><i className="material-icons">create</i></Link>
    </span>
    <span>
      <Link to={ROUTES.ACCOUNT}><i className="material-icons">person</i></Link>
    </span>
    <span>
      <SignOutButton />
    </span>
  </div>
);

const NavigationNonAuth = () => (
  <ul>
    <span>
      <Link to={ROUTES.HOME}><i className="material-icons">home</i></Link>
    </span>
    <span>
      <Link to={ROUTES.PROJECTS}><i className="material-icons">code</i></Link>
    </span>
    <span>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </span>
  </ul>
);

export default Navigation;
