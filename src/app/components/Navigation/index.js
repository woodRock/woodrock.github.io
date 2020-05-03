import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import ROUTES from '../../constants/routes';
import { AuthUserContext } from '../../util/Session';
import me from '../../../assets/me.jpg';
import './index.css';

const Navigation = () => (
  <div>
    <ul>
      <li>
        <img className="avatar" width="80%" src={me} alt=""/>
      </li>
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <NavigationAuth /> : <NavigationNonAuth />
        }
      </AuthUserContext.Consumer>
    </ul>
  </div>
);

const NavigationAuth = () => (
  <ul>
    {ROUTES.map(r => (
      (r.icon === '')
        ? null
        : <li key={r.path}><Link className="link" to={r.path}><i className="link material-icons">{r.icon}</i><span className="link link-text">{r.name}</span></Link></li>
    ))}
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    {ROUTES.map(r => (
      (r.auth || r.icon === '')? null : <li key={r.path}><Link to={r.path}><i className="link material-icons">{r.icon}</i><span className="link link-text">{r.name}</span></Link></li>
    ))}
    <li>
      <Link className="link" to='/signin'><i className="link material-icons">person</i></Link>
    </li>
  </ul>
);

export default Navigation;
