import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import ROUTES from '../../constants/routes';
import { AuthUserContext } from '../../util/Session';

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
      {ROUTES.map(r => (
        <Link to={r.path}><i className="material-icons">{r.icon}</i></Link>
      ))}
    </span>
    <SignOutButton />
  </div>
);

const NavigationNonAuth = () => (
  <ul>
    {ROUTES.map(r => (
      r.auth ? null : <Link to={r.path}><i className="material-icons">{r.icon}</i></Link>
    ))}
    <span>
      <Link to='/signin'><i className="material-icons">person</i></Link>
    </span>
  </ul>
);

export default Navigation;
