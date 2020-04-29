import React, { Component } from 'react';
import { withFirebase } from '../../util/Firebase';

class SocialPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      social: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.social().orderBy('title').get().then(
      querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              'id': doc.id,
              'title': doc.data().title,
              'link': doc.data().link,
              'image': doc.data().image,
              'description': doc.data().description
            };
            this.state.social.push(data);
            if (this.state.social.length > 0){
              this.setState({ loading: false })
            }
          })
        }
      )
  }

  render() {
    const { social, loading } = this.state;
    return (
      <div>
        {loading && <div>...</div>}
        {social ? (
          <SocialList social={social} />
        ) : (
          <div>There are no social links ...</div>
        )}
      </div>
    );
  }
}

const SocialList = ({ social }) => (
  <div className="social">
    {social.map(s => (
      <SocialItem key={s.id} social={s} />
    ))}
  </div>
);

const SocialItem = ({ social }) => (
  <span>
    <a href={social.link}><i className={"link fa fa-" + social.title}></i></a>
  </span>
);

export default withFirebase(SocialPage);
