import React from 'react';
import {AuthUserContext, withAuthorization} from '../../util/Session';
import {PasswordForgetForm} from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import './index.css';

const AccountPage = () => (<AuthUserContext.Consumer>
  {
    authUser => (<div className="account twitter-style-border">
      <h1>Accounts</h1>
      <strong>email:</strong>
      {authUser.email}
      <PasswordForgetForm/>
      <PasswordChangeForm/>
    </div>)
  }
</AuthUserContext.Consumer>);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);
