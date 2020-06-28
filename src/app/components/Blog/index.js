import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { withFirebase } from '../../util/Firebase';
import TimeAgo from '../../util/TimeAgo';
import logo from '../../../assets/logo.png';
import Loading from '../Loading';
import './index.css';

const BlogPage = (props) => {
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    const blogs = () => {
      props.firebase.blog().orderBy('title').get().then(
        querySnapshot => {
            querySnapshot.forEach(doc => {
              const data = {
                'id': doc.id,
                'title': doc.data().title,
                'time': doc.data().time,
                'markdown': doc.data().markdown
              };
              setBlog(prevBlog => [...prevBlog, data]);
            })
          }
        )
      };
      blogs();
    }
  );

  return (
    <div className="blog">
      <h1>Blog</h1>
      {!blog.length && <Loading/>}
      {blog ? (
        <BlogList blog={blog.sort((a,b) => new Date(b.time) - new Date(a.time))} />
      ) : (
        <div>There are no blog posts ...</div>
      )}
    </div>
  );
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
