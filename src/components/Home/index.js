import React from 'react';
import { withAuthorization } from '../Session';
import logo from '../../assets/logo.png';
import ReactMarkdown from 'react-markdown';

const markdown =
`
# Home

I am a 3rd year Software Engineering student at the University of Wellington.

I spend my time:

1. university
2. volunteering work for NIWA
3. personal projects

Some of my other interests include:

1. Guitar
2. Space
3. Canoe Polo
`

const HomePage = () => (
  <div>
    <ReactMarkdown source={markdown}/>
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
