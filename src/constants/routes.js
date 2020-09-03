import Home from "../pages/Home";
import Projects from "../pages/Projects";
import ViewProject from "../pages/ViewProject";
import Blog from "../pages/Blog";
import ViewBlog from "../pages/ViewBlog";
import Skills from "../pages/Skills";
import Education from "../pages/Education";
import Jobs from "../pages/Jobs";

const ROUTES = [
  {
    path: "/",
    component: Home,
  },
  {
    name: "Home",
    path: "/home",
    component: Home,
    icon: "home", // material-icons class name
  },
  {
    name: "Projects",
    path: "/projects",
    component: Projects,
    icon: "code",
  },
  {
    name: "Blog",
    path: "/blog",
    component: Blog,
    icon: "create",
  },
  {
    name: "Skills",
    path: "/skills",
    component: Skills,
    icon: "language",
  },
  {
    name: "Education",
    path: "/education",
    component: Education,
    icon: "school",
  },
  {
    name: "Jobs",
    path: "/job",
    component: Jobs,
    icon: "work",
  },
  {
    path: "/blog/:id",
    component: ViewBlog,
  },
  {
    path: "/project/:id",
    component: ViewProject,
  },
];

export default ROUTES;
