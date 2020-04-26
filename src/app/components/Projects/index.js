import React, { Component } from 'react';
import { withFirebase } from '../../util/Firebase';
import TimeAgo from '../../util/TimeAgo';

class ProjectsPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      projects: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.projects().orderBy('title').get().then(
      querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              'id': doc.id,
              'title': doc.data().title,
              'link': doc.data().link,
              'image': doc.data().image,
              'description': doc.data().description,
              'time': doc.data().time
            };
            this.state.projects.push(data);
            if (this.state.projects.length > 0){
              this.setState({ loading: false })
            }
          })
        }
      )
  }

  render() {
    const { projects, loading } = this.state;
    return (
      <div>
        <h1>Projects</h1>
        {loading && <div>Loading ...</div>}
        {projects ? (
          <ProjectList projects={projects} />
        ) : (
          <div>There are no projects ...</div>
        )}
      </div>
    );
  }
}

const ProjectList = ({ projects }) => (
  <ul>
    {projects.map(project => (
      <ProjectItem key={project.id} project={project} />
    ))}
  </ul>
);

const ProjectItem = ({ project }) => (
  <li>
    <p>
      <strong>{project.title}</strong>
    </p>
    <a href={project.link}>
      <img height="30" width="30" src={project.image} alt={project.title}/>
    </a>
    <i>
      {TimeAgo( { date: project.time} )}
    </i>
    {project.description}
  </li>
);

export default withFirebase(ProjectsPage);
