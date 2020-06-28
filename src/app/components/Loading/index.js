import React, {Component} from 'react';
import './index.css';
import logo from '../../../assets/logo.png';

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: 3
    }
  }

  render() {
    return (<div className="loading stage">
      <img className="square loading-logo" style={{
          animation: `spin ${this.state.speed}s linear infinite`
        }} src={logo} alt="img"/>
    </div>);
  }
}

export default Loading;
