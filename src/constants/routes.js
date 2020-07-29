import Projects from "../components/Projects";
import React from "react";
import Blog from "../components/Blog";
import ViewBlog from "../components/ViewBlog";
import ViewProject from "../components/ViewProject";
import Timeline from "../api/Timeline";
import {withMarkdown} from "../api/Markdown";
import home from "../assets/home.md";
import skills from "../assets/skills.md";
import ibsMD from "../assets/schools/ibs.md";
import swisMD from "../assets/schools/swis.md";
import rcMD from "../assets/schools/rc.md";
import vuwMD from "../assets/schools/vuw.md";
import macsMD from "../assets/jobs/macs.md";
import niwaMD from "../assets/jobs/niwa.md";
import johnsMD from "../assets/jobs/stjohns.md";

const Home = withMarkdown(home);
const Skills = withMarkdown(skills);

const schools = [
  withMarkdown(vuwMD),
  withMarkdown(rcMD),
  withMarkdown(swisMD),
  withMarkdown(ibsMD)
];

const Education = () => {
  return <Timeline title="Education" events={schools} />;
};

const jobs = [
  withMarkdown(niwaMD),
  withMarkdown(johnsMD),
  withMarkdown(macsMD)
];

const Jobs = () => {
  return <Timeline title="Jobs" events={jobs} />;
};

const ROUTES = [
  {
    path: "/",
    component: Home
  },
  {
    name: "Home",
    path: "/home",
    component: Home,
    icon: "home" // material-icons class name
  },
  {
    name: "Projects",
    path: "/projects",
    component: Projects,
    icon: "code"
  },
  {
    name: "Blog",
    path: "/blog",
    component: Blog,
    icon: "create"
  },
  {
    name: "Skills",
    path: "/skills",
    component: Skills,
    icon: "language"
  },
  {
    name: "Education",
    path: "/education",
    component: Education,
    icon: "school"
  },
  {
    name: "Jobs",
    path: "/job",
    component: Jobs,
    icon: "work"
  },
  {
    path: "/blog/:id",
    component: ViewBlog
  },
  {
    path: "/project/:id",
    component: ViewProject
  }
];

export default ROUTES;
