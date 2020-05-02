import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { withFirebase } from '../../util/Firebase';
import TimeAgo from '../../util/TimeAgo';
import logo from '../../../assets/logo.png';
import Loading from '../Loading';

class BlogPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      blog: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.blog().orderBy('title').get().then(
      querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              'id': doc.id,
              'title': doc.data().title,
              'time': doc.data().time,
              'markdown': doc.data().markdown
            };
            this.state.blog.push(data);
            if (this.state.blog.length > 0){
              this.setState({ loading: false })
            }
          })
        }
      )
  }

  render() {
    const { blog, loading } = this.state;
    return (
      <div className="blog">
        <h1>Blog</h1>
        {loading && <Loading/>}
        {blog ? (
          <BlogList blog={blog.sort((a,b) => new Date(b.time) - new Date(a.time))} />
        ) : (
          <div>There are no blog posts ...</div>
        )}
      </div>
    );
  }
}

const BlogList = ({ blog }) => (
  <div>
    {blog.map(s => (
      <BlogItem key={s.id} blog={s} />
    ))}
  </div>
);

const BlogItem = ({ blog }) => (
  <div className="blog-post twitter-style-border">
    <div className="title">
      <img class="logo" src={logo} alt="woodRock github logo"/>
      <span class="blog-title-text">
        woodRock •
          <i>
            <span className="secondary"> {TimeAgo({date: blog.time})}</span>
          </i>
      </span>
    </div>
    <div className="blog-content">
      <h2>{blog.title}</h2>
      <ReactMarkdown
        source={
          (blog.markdown + "").replace(/\\n/g,"\n\n")
        }
      />
    </div>
  </div>
);

export default withFirebase(BlogPage);
