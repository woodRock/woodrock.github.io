import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useFirebase } from "../api/Firebase";
import TimeAgo from "../components/TimeAgo";
import Loading from "../components/Loading";
import logo from "../assets/logo.png";

const ViewProject = () => {
  const [project, setProject] = useState();
  const { fetch } = useFirebase();
  let { id } = useParams();

  useEffect(() => {
    fetch("projects", "time", {
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
  }, [id, fetch]);

  return (
    <div>
      <h1>Projects</h1>
      <hr />
      <div className="project">
        {" "}
        {project ? <Project {...project} /> : <Loading />}{" "}
      </div>
    </div>
  );
};

const Project = ({ id, title, time, description, link, image }) => (
  <div>
    <div>
      <Link className="github-link" to="/projects">
        <i className="material-icons">chevron_left</i>
        <span>{"  "}</span>
        <span className="link-text">Back</span>
      </Link>
    </div>
    <img
      style={{ marginLeft: "15%", maxWidth: "50hw", maxHeight: "50vh" }}
      src={image}
      alt={title}
    />
    <h1 style={{ marginLeft: "15%" }}>{title}</h1>
    <div style={{ marginLeft: "15%", marginRight: "30%" }}>
      <hr />
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
            date: time,
          })}
        </span>
        &emsp;
        <a href={link} className="github-link">
          <i className="fa fa-github" />
          <span>{"  "}</span>
          <span className="link-text">View Source </span>
        </a>
      </span>
      <hr />
    </div>
    <div style={{ marginLeft: "15%", marginRight: "30%" }}>
      <div style={styles.description}>
        <ReactMarkdown source={description} />
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
