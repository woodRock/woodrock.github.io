import React from 'react';
import { withFirebase } from '../../util/Firebase';
import { Link } from 'react-router-dom';

const SignOutButton = ({ firebase }) => (
  <Link onClick={firebase.doSignOut}><i className="link material-icons">exit_to_app</i></Link>
);

export default withFirebase(SignOutButton);
