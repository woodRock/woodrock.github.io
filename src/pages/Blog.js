import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import TimeAgo from "../components/TimeAgo";
import Collection from "../components/Collection";
import logo from "../assets/logo.png";

const Blog = () => {
  return <Collection Child={BlogItem} collectionName={"blog"} sort={"time"} />;
};

const BlogItem = ({ item }) => (
  <div className="blog-post twitter-style-border">
    <div className="title">
      <img className="logo" src={logo} alt="woodRock github logo" />
      <span className="blog-title-text">
        woodRock •
        <i>
          <span className="secondary">{TimeAgo({ date: item.time })}</span>
        </i>
      </span>
    </div>
    <div className="blog-content">
      <h2>
        <Link to={"/blog/" + item.id}>{item.title}</Link>
      </h2>
      <ReactMarkdown source={item.markdown + ""} />
    </div>
  </div>
);

export default Blog;
