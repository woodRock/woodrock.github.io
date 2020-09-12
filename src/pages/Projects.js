import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import TimeAgo from "../components/TimeAgo";
import Collection from "../components/Collection";
import logo from "../assets/logo.png";
import "../index.css";

const Projects = () => {
  return <Collection Child={Project} collectionName="projects" sort="time" />;
};

const Project = ({ item }) => (
  <div className="project-container">
    <div className="title">
      <img className="logo" src={logo} alt="woodRock github logo" />
      <span className="project-title-text">
        <span className="header">@woodRock</span>•
        <i className="secondary">{TimeAgo({ date: item.time })}</i>
      </span>
      <div className="description text">
        <h2>
          <Link id="nav-link" to={"/project/" + item.id}>
            {item.title}
          </Link>
        </h2>
        <ReactMarkdown source={item.description} />
      </div>
    </div>
    <div className="project">
      <a href={item.link}>
        <img
          className="project-image"
          width="100%"
          height="width"
          src={item.image}
          alt={item.title}
        />
      </a>
      <div>
        <a href={item.link} className="github-link">
          <i className="fa fa-github" />
        </a>
      </div>
    </div>
  </div>
);

export default Projects;
