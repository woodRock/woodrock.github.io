import React from 'react';
import './index.css';
import logo from '../../../assets/logo.png';

const speed = 3;

const Loading = () => {
  return (<div className="loading stage">
    <img className="square loading-logo" style={{
        animation: `spin ${speed}s linear infinite`
      }} src={logo} alt="img"/>
  </div>);
}

export default Loading;
