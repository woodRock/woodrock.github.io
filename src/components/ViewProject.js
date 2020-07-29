import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useFirebase } from "../util/context";
import Loading from "./Loading";

const ViewProject = props => {
  const [project, setProject] = useState();
  const { fetch } = useFirebase();
  let { id } = useParams();

  useEffect(() => {
    const unsubscribe = fetch("projects", "time", {
      next: querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            ...doc.data()
          };
          if (id === data.id) {
            setProject(data);
          }
        });
      }
    });
    return unsubscribe;
  }, [id, fetch]);

  return (
    <div className="project">
      {" "}
      {project ? <Project {...project} /> : <Loading />}{" "}
    </div>
  );
};

const Project = ({ id, title, description, link, image }) => (
  <div className="project-container">
    <div className="title">
      <h1>
        <Link to="/projects">
          <i className="material-icons">chevron_left</i>
        </Link>
        <Link to={"/project/" + id}>{title}</Link>
      </h1>
      <div className="description text">
        <ReactMarkdown source={description}></ReactMarkdown>
      </div>
    </div>
    <div className="project">
      <a href={link}>
        <img
          className="project-image"
          width="100%"
          height="width"
          src={image}
          alt={title}
        />
      </a>
      <div>
        <a href={link} className="github-link">
          <i className="fa fa-github"></i>
        </a>
      </div>
    </div>
  </div>
);

export default ViewProject;
