import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {fetch} from "../../../util/Firebase";
import Loading from "../../Loading";
import "../index.css";

const ViewProject = props => {
  const [project, setProject] = useState();
  let {id} = useParams();

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
  }, [id]);

  return (<div className="project">
    {" "}
    {
      (project)
        ? <ProjectItem project={project}/>
        : <Loading/>
    }{" "}
  </div>);
};

const ProjectItem = ({project}) => (<div className="project-container">
  <div className="title">
    <h1>
      <Link to="/projects">
        <i className="material-icons">chevron_left</i>
      </Link>
      <Link to={'/project/' + project.id}>{project.title}</Link>
    </h1>
    <div className="description text">
      <ReactMarkdown source={project.description}></ReactMarkdown>
    </div>
  </div>
  <div className="project">
    <a href={project.link}>
      <img class="project-image" width="100%" height="width" src={project.image} alt={project.title}/>
    </a>
    <div>
      <a href={project.link} className="github-link">
        <i className="fa fa-github"></i>
      </a>
    </div>
  </div>
</div>);

export default ViewProject;
