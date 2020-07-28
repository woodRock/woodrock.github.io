import Home from "../components/Home/Home";
import Projects from "../components/Projects/Projects";
import Blog from "../components/Blog/Blog";
import Education from "../components/Education/Education";
import Jobs from "../components/Job/Jobs";
import Skills from "../components/Skills/Skills";
import CV from "../components/CV/CV";
import ViewBlog from "../components/Blog/View";
import ViewProject from "../components/Projects/View";

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
    path: "/cv",
    component: CV,
    icon: ""
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
