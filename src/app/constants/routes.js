import HomePage from '../components/Home';
import ProjectsPage from '../components/Projects';
import BlogPage from '../components/Blog';
import EducationPage from '../components/Education';
import JobPage from '../components/Job';
import SkillsPage from '../components/Skills';
import CVPage from '../components/CV';
import LandingPage from '../components/Landing';

const ROUTES = [{
    path: '',
    component: LandingPage,
  },
  {
    name: 'Home',
    path: '/home',
    component: HomePage,
    icon: 'home', // material-icons class name
  },
  {
    name: 'Projects',
    path: '/projects',
    component: ProjectsPage,
    icon: 'code',
  },
  {
    name: 'Blog',
    path: '/blog',
    component: BlogPage,
    icon: 'create',
  },
  {
    name: 'Skills',
    path: '/skills',
    component: SkillsPage,
    icon: 'language',
  },
  {
    name: 'Education',
    path: '/education',
    component: EducationPage,
    icon: 'school',
  },
  {
    name: 'Jobs',
    path: '/job',
    component: JobPage,
    icon: 'work'
  },
  {
    path: '/cv',
    component: CVPage,
    icon: '',
  }
];

export default ROUTES;
