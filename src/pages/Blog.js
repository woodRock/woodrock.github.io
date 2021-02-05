import React from "react";
import { Link } from "react-router-dom";
import { timeToRead, teaser } from "../api/utility";
import TimeAgo from "../components/TimeAgo";
import Collection from "../components/Collection";

const Blog = () => {
  const props = { Child: BlogItem, collectionName: "blog", sort: "time" };
  return (
    <div>
      <Collection {...props} />
    </div>
  );
};

const BlogItem = ({ item }) => (
  <div style={{ marginLeft: "30%", marginRight: "30%" }}>
    <div>
      <Link to={"/blogs/" + item.id}>
        <h2>{item.title}</h2>
      </Link>
      <i>
        <span className="">{TimeAgo({ date: item.time })}</span>
        &emsp;
        <span class="material-icons">query_builder</span>
        <span style={{ textAlign: "left" }}>
          {timeToRead(item.markdown) + " mins"}
        </span>
      </i>
      <br />
      <p> {teaser(item.markdown)}</p>
    </div>
    <hr />
  </div>
);

export default Blog;
