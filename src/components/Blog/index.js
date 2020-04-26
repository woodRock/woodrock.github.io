import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import ReactMarkdown from 'react-markdown';

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
      <div>
        <h1>Blog</h1>
        {loading && <div>Loading ...</div>}
        {blog ? (
          <BlogList blog={blog} />
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
  <div>
    <h2>{blog.title}</h2>
    <ReactMarkdown source={blog.markdown}/>
  </div>
);

export default withFirebase(BlogPage);
