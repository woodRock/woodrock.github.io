import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../util/Firebase';

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

class SignUpFormBase extends Component {
  constructor(props){
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
          });
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push('/home');
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={this.onSubmit}>
        <p>
          <input
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
          />
        </p>
        <p>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
        </p>
        <p>
          <input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </p>
        <p>
          <input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          />
        </p>
        <p>
          <button disabled={isInvalid} type="submit">
            Sign Up
          </button>
        </p>
        <div className="error-message">
          {error && <p>{error.message}</p>}
        </div>
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Dont have an account?
    <span> </span>
    <Link to='/signup'>Sign Up</Link>
  </p>
);

export default SignUpPage;

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export { SignUpForm, SignUpLink}
