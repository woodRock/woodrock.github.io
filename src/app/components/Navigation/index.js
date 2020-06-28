import React from 'react';
import { Link } from 'react-router-dom';
import ROUTES from '../../constants/routes';
import me from '../../../assets/me.jpg';
import './index.css';

const Navigation = () => (
  <div>
    <ul>
      <li>
        <img className="avatar" width="80%" src={me} alt=""/>
      </li>
      <Pages />
    </ul>
  </div>
);

const Pages = () => (
  <ul>
    {ROUTES.map(r => (
      (r.icon === '')
        ? null
        : <li key={r.path}><Link className="link" to={r.path}><i className="link material-icons">{r.icon}</i><span className="link link-text">{r.name}</span></Link></li>
    ))}
  </ul>
);

export default Navigation;
