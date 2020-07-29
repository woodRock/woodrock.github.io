import Projects from "../components/Projects";
import Blog from "../components/Blog";
import Education from "../components/Education";
import Jobs from "../components/Jobs";
import CV from "../components/CV";
import ViewBlog from "../components/ViewBlog";
import ViewProject from "../components/ViewProject";
import {withMarkdown} from "../util/Markdown";
import home from "../constants/home.md";
import skills from "../constants/skills.md";

const Home = withMarkdown(home);
const Skills = withMarkdown(skills);

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
