import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

class LandingPageBase extends Component {
  constructor(props){
    super(props);
    this.props.history.push('/home');
  }

  render() {
    return null;
  }
}

const LandingPage = compose(
  withRouter
)(LandingPageBase);

export default LandingPage;
