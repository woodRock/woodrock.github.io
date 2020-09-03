import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import TimeAgo from "../components/TimeAgo";
import { useFirebase } from "../api/context";
import logo from "../assets/logo.png";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { v4 } from "uuid";

const Blog = () => {
  const [blog, setBlog] = useState([]);
  const { fetch } = useFirebase();

  useEffect(() => {
    const unsubscribe = fetch("blog", "time", {
      next: (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          };
          setBlog((prevBlog) => [...prevBlog, data]);
        });
      },
    });
    return () => unsubscribe();
  }, [fetch]);

  return (
    <div className="blog">
      <h1>Blog</h1>
      {!blog.length && <Loading />}
      {blog ? (
        <BlogList
          blog={blog.sort((a, b) => new Date(b.time) - new Date(a.time))}
        />
      ) : (
        <div>There are no blog posts ...</div>
      )}
    </div>
  );
};

const BlogList = ({ blog }) => (
  <div>
    {blog.map((s) => (
      <BlogItem key={v4()} blog={s} />
    ))}
  </div>
);

const BlogItem = ({ blog }) => (
  <div className="blog-post twitter-style-border">
    <div className="title">
      <img className="logo" src={logo} alt="woodRock github logo" />
      <span className="blog-title-text">
        woodRock •
        <i>
          <span className="secondary">{TimeAgo({ date: blog.time })}</span>
        </i>
      </span>
    </div>
    <div className="blog-content">
      <h2>
        <Link to={"/blog/" + blog.id}>{blog.title}</Link>
      </h2>
      <ReactMarkdown source={blog.markdown + ""} />
    </div>
  </div>
);

export default Blog;
