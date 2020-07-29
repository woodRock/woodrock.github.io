import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useFirebase } from "../api/context";
import TimeAgo from "../api/TimeAgo";
import logo from "../assets/logo.png";
import Loading from "./Loading";

const ViewBlog = props => {
  const [blog, setBlog] = useState();
  const { fetch } = useFirebase();
  let { id } = useParams();

  useEffect(() => {
    const unsubscribe = fetch("blog", "time", {
      next: querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            ...doc.data()
          };
          if (id === data.id) {
            setBlog(data);
          }
        });
      }
    });
    return unsubscribe;
  }, [id, fetch]);

  return (
    <div className="blog">
      {" "}
      {blog ? <BlogItem blog={blog} /> : <Loading />}{" "}
    </div>
  );
};

const BlogItem = ({ blog }) => (
  <div className="blog-post twitter-style-border">
    <h1>
      <Link to="/blog">
        <i className="material-icons">chevron_left</i>
      </Link>
      {blog.title}
    </h1>
    <div className="title">
      <img class="logo" src={logo} alt="woodRock github logo" />
      <span class="blog-title-text">
        woodRock•{" "}
        <i>
          <span className="secondary">
            {" "}
            {TimeAgo({
              date: blog.time
            })}{" "}
          </span>{" "}
        </i>{" "}
      </span>{" "}
    </div>{" "}
    <div className="blog-content">
      <ReactMarkdown source={blog.markdown + ""} />{" "}
    </div>{" "}
  </div>
);

export default ViewBlog;
