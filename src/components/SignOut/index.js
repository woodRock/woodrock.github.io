import React from 'react';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const SignOutButton = ({ firebase }) => (
  <Link onClick={firebase.doSignOut}><i className="material-icons">exit_to_app</i></Link>
);

export default withFirebase(SignOutButton);
