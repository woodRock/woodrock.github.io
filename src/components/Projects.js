import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useFirebase } from "../util/context";
import TimeAgo from "../util/TimeAgo";
import logo from "../assets/logo.png";
import Loading from "./Loading";
import uuid from "uuid";
import { Link } from "react-router-dom";

const Projects = props => {
  const [projects, setProjects] = useState([]);
  const { fetch } = useFirebase();

  useEffect(() => {
    const unsubscribe = fetch("projects", "time", {
      next: querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            ...doc.data()
          };
          setProjects(prevProjects => [...prevProjects, data]);
        });
      }
    });
    return unsubscribe;
  }, [fetch]);

  return (
    <div>
      <h1>Projects</h1>
      {!projects.length && <Loading />}
      {projects ? (
        <ProjectList
          projects={projects.sort(
            (a, b) => new Date(b.time) - new Date(a.time)
          )}
        />
      ) : (
        <div>There are no projects ...</div>
      )}
    </div>
  );
};

const ProjectList = ({ projects }) => (
  <div>
    {projects.map(project => (
      <Project key={uuid.v4()} project={project} />
    ))}
  </div>
);

const Project = ({ project }) => (
  <div className="project-container">
    <div className="title">
      <img class="logo" src={logo} alt="woodRock github logo" />
      <span className="project-title-text">
        <span className="header">@woodRock</span>•
        <i className="secondary">{TimeAgo({ date: project.time })}</i>
      </span>
      <div className="description text">
        <h2>
          <Link to={"/project/" + project.id}>{project.title}</Link>
        </h2>
        <ReactMarkdown source={project.description}></ReactMarkdown>
      </div>
    </div>
    <div className="project">
      <a href={project.link}>
        <img
          class="project-image"
          width="100%"
          height="width"
          src={project.image}
          alt={project.title}
        />
      </a>
      <div>
        <a href={project.link} className="github-link">
          <i className="fa fa-github"></i>
        </a>
      </div>
    </div>
  </div>
);

export default Projects;
