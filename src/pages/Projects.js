import React from "react";
import { Link } from "react-router-dom";
import TimeAgo from "../components/TimeAgo";
import Collection from "../components/Collection";
import logo from "../assets/logo.png";
import "./Projects.css";

const Projects = () => {
  return (
    <Collection
      Child={Project}
      collectionName="projects"
      sort="time"
      styles="card-list"
    />
  );
};

const Project = ({ item }) => {
  return (
    <article className="card">
      <header className="card-header">
        <i className="secondary">{TimeAgo({ date: item.time })}</i>
        <Link id="nav-link" to={"/projects/" + item.id}>
          <h2>{item.title}</h2>
        </Link>
      </header>
      <div className="card-image">
        <Link to={"/projects/" + item.id}>
          <img src={item.image} alt={item.title} />
        </Link>
      </div>
      <div className="card-author">
        <a href="#" className="author-avatar">
          <img src={logo} alt="Woodrock logo" />
        </a>
        <svg className="half-circle" viewBox="0 0 106 57">
          <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
        </svg>
        <div className="author-name">
          <div className="author-name-prefix">Author</div>
          Jesse Wood
        </div>
      </div>
    </article>
  );
};

export default Projects;
