import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import ROUTES from '../../constants/routes';
import { AuthUserContext } from '../../util/Session';
import logo from '../../../assets/logo.png';
import me from '../../../assets/me.jpg';
import SocialPage from '../Social';

const Navigation = () => (
  <div>
    <ul>
      <li>
        <img width="80%" src={me} alt=""/>
      </li>
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <NavigationAuth /> : <NavigationNonAuth />
        }
      </AuthUserContext.Consumer>
    </ul>
    <SocialPage></SocialPage>
  </div>
);

const NavigationAuth = () => (
  <ul>
    {ROUTES.map(r => (
      (r.icon === '')
        ? null
        : <li><Link to={r.path}><i className="material-icons">{r.icon}</i><a className="link">{r.name}</a></Link></li>
    ))}
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    {ROUTES.map(r => (
      (r.auth || r.icon === '')? null : <li><Link to={r.path}><i className="material-icons">{r.icon}</i><a className="link">{r.name}</a></Link></li>
    ))}
    <li>
      <Link to='/signin'><i className="material-icons">person</i></Link>
    </li>
  </ul>
);

export default Navigation;
