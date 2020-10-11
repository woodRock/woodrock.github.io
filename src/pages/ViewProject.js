import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useFirebase } from "../api/Firebase";
import Loading from "../components/Loading";

const ViewProject = () => {
  const [project, setProject] = useState();
  const { fetch } = useFirebase();
  let { id } = useParams();

  useEffect(() => {
    const unsubscribe = fetch("projects", "time", {
      next: (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          };
          if (id === data.id) {
            setProject(data);
          }
        });
      },
    });
    return () => unsubscribe();
  }, [id, fetch]);

  return (
    <div className="project">
      {" "}
      {project ? <Project {...project} /> : <Loading />}{" "}
    </div>
  );
};

const Project = ({ id, title, description, link, image }) => (
  <div className="project-container twitter-style-border">
    <div className="link-container">
      <Link className="github-link" to="/blog">
        <i className="material-icons">chevron_left</i>
        <span>{"  "}</span>
        <span className="link-text">Back</span>
      </Link>
      <div style={styles.container}>
        <h1>
          <Link to={"/project/" + id}>{title}</Link>
        </h1>
        <a href={link}>
          <img style={styles.image} src={image} alt={title} />
        </a>
        <div style={styles.description}>
          <ReactMarkdown source={description} />
        </div>
        <div className="link-container">
          <a href={link} className="github-link">
            <i className="fa fa-github" />
            <span>{"  "}</span>
            <span className="link-text">View Source </span>
          </a>
        </div>
      </div>
    </div>
  </div>
);

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    width: "60%",
    minHeight: "100vh",
    padding: "2.5rem",
  },
  description: {},
  image: {
    width: "200px",
    height: "200px",
  },
};

export default ViewProject;
