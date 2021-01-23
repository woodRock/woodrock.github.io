import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useFirebase } from "../api/Firebase";
import TimeAgo from "../components/TimeAgo";
import Loading from "../components/Loading";

const ViewBlog = () => {
  const [blog, setBlog] = useState();
  const { fetch } = useFirebase();
  let { id } = useParams();

  useEffect(() => {
    fetch("blog", "time", {
      next: (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          };
          if (id === data.id) {
            setBlog(data);
          }
        });
      },
    });
  }, [id, fetch]);

  return (
    <div className="blog">
      {" "}
      {blog ? <BlogItem item={blog} /> : <Loading />}{" "}
    </div>
  );
};

const BlogItem = ({ item }) => (
  <div className="blog-post twitter-style-border">
    <div className="link-container">
      <Link className="github-link" to="/blog">
        <i className="material-icons">chevron_left</i>
        <span>{"  "}</span>
        <span className="link-text">Back</span>
      </Link>
    </div>
    <h1>{item.title}</h1>
    <div className="blog-content">
      <div className="title">
        <span className="blog-title-text">
          <i>
            <span className="secondary">
              {TimeAgo({
                date: item.time,
              })}
            </span>
          </i>
        </span>
      </div>
      <div>
        <ReactMarkdown source={item.markdown} />
      </div>
    </div>
  </div>
);

export default ViewBlog;
