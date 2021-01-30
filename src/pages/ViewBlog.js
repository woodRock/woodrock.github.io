import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useFirebase } from "../api/Firebase";
import { timeToRead } from "../api/blog";
import TimeAgo from "../components/TimeAgo";
import Loading from "../components/Loading";
import logo from "../assets/logo.png";

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
  <div>
    <div className="link-container">
      <Link className="github-link" to="/blogs">
        <i className="material-icons">chevron_left</i>
        &nbsp;
        <span className="link-text">Back</span>
      </Link>
    </div>
    <h1 style={{ marginLeft: "15%" }}>{item.title}</h1>
    <hr />
    <div style={{ marginLeft: "15%" }}>
      <img
        style={{ height: "50px", width: "50px", borderRadius: "50px" }}
        src={logo}
        alt="Brand Logo"
      />
      &emsp;
      <span>
        <span>Jesse Wood</span>
        &emsp;
        <span className="secondary">
          {TimeAgo({
            date: item.time,
          })}
        </span>
        &emsp;
        <span class="material-icons">query_builder</span>
        &nbsp;
        <span style={{ textAlign: "left" }}>
          {timeToRead(item.markdown) + " mins"}
        </span>
      </span>
    </div>
    <hr />
    <div style={{ marginLeft: "15%", marginRight: "30%" }}>
      <ReactMarkdown source={item.markdown} />
    </div>
  </div>
);

export default ViewBlog;
