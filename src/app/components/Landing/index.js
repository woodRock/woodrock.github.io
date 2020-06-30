import {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';

const LandingPageBase = (props) => {
  useEffect(() => {
    props.history.push('/home');
  }, [props.history])

  return null;
}

const LandingPage = compose(withRouter)(LandingPageBase);

export default LandingPage;
