import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useFirebase } from "../api/context";
import TimeAgo from "../components/TimeAgo";
import Loading from "../components/Loading";
import logo from "../assets/logo.png";

const ViewBlog = () => {
  const [blog, setBlog] = useState();
  const { fetch } = useFirebase();
  let { id } = useParams();

  useEffect(() => {
    const unsubscribe = fetch("blog", "time", {
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
    return () => unsubscribe();
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
    <h1>
      <Link to="/blog">
        <i className="material-icons">chevron_left</i>
      </Link>
      {item.title}
    </h1>
    <div className="title">
      <img className="logo" src={logo} alt="woodRock github logo" />
      <span className="blog-title-text">
        woodRock•{" "}
        <i>
          <span className="secondary">
            {" "}
            {TimeAgo({
              date: item.time,
            })}{" "}
          </span>{" "}
        </i>{" "}
      </span>{" "}
    </div>{" "}
    <div className="blog-content">
      <ReactMarkdown source={item.markdown + ""} />{" "}
    </div>{" "}
  </div>
);

export default ViewBlog;
